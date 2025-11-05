import { Result, type TrackedHabit } from "$lib";
import type Database from "@tauri-apps/plugin-sql";

export const createNewHabit = async (
    db: Database,
    name: string,
    icon: string,
    description: string
): Promise<TrackedHabit> => {
    if (!name || name.trim().length === 0)
        throw new Error("Habit name is required");

    try {
        const now = new Date();
        await db.execute(
            `INSERT INTO habits (name, icon, description, created_at) VALUES ($1, $2, $3, $4)`,
            [name, icon || "smoking", description, now.toISOString()]
        );

        const rows = await db.select<{ id: number }[]>(
            `SELECT last_insert_rowid() as id`
        );
        const id = rows?.[0]?.id;
        if (!id) throw new Error("Failed to retrieve inserted habit id");

        await db.execute(
            `INSERT INTO habit_tracking (habit_id, start_date, failed) VALUES ($1, $2, 0)`,
            [id, now.toISOString()]
        );
        const lastRow = await db.select<
            { id: number; start_date: Date; habit_id: number }[]
        >(
            `SELECT id, start_date, habit_id FROM habit_tracking WHERE id = last_insert_rowid()`
        );

        return {
            id: lastRow[0].id,
            name,
            icon,
            start_date: lastRow[0].start_date,
            habit_id: lastRow[0].habit_id,
        };
    } catch (err: any) {
        // friendly error for unique constraint on name
        if (
            err &&
            typeof err.message === "string" &&
            err.message.toLowerCase().includes("unique")
        ) {
            throw new Error("A habit with that name already exists");
        }
        throw err;
    }
};

export async function getAllActiveHabitsNotFailed(
    db: Database
): Promise<TrackedHabit[]> {
    const rows = await db.select<
        {
            id: number;
            name: string;
            icon: string;
            start_date: string;
            habit_id: number;
        }[]
    >(`
        SELECT
          ht.id as id,
          h.name as name,
          h.icon as icon,
          h.id as habit_id,
          ht.start_date as start_date
        FROM habits h
        INNER JOIN habit_tracking ht ON h.id = ht.habit_id
        WHERE h.is_active = 1 AND ht.failed = 0
        ORDER BY ht.start_date DESC
    `);

    return (rows || []).map((r) => ({
        id: r.id,
        name: r.name,
        icon: r.icon,
        start_date: r.start_date ? new Date(r.start_date) : new Date(),
        habit_id: r.habit_id,
    }));
}

/**
 * Delete all tracking rows for a habit (does NOT delete the habit itself).
 * Useful when you want to clear the history while keeping the habit record.
 */
export async function deleteHabitTrackingByHabitId(
    db: Database,
    habitId: number
): Promise<Result> {
    if (typeof habitId !== "number" || Number.isNaN(habitId)) {
        throw new Error("habitId must be a valid number");
    }

    await db.execute(`DELETE FROM habit_tracking WHERE habit_id = $1`, [
        habitId,
    ]);
    return Result.Ok;
}

/**
 * Delete the habit row itself. Because `habit_tracking` references `habits` with
 * ON DELETE CASCADE, the related tracking rows will be removed automatically.
 * Returns 1 if a row was deleted, or 0 if no habit with the id existed.
 */
export async function deleteHabitById(
    db: Database,
    habitId: number
): Promise<Result> {
    if (typeof habitId !== "number" || Number.isNaN(habitId))
        throw new Error("habitId must be a valid number");

    await db.execute(`DELETE FROM habits WHERE id = $1`, [habitId]);
    return Result.Ok;
}

/**
 * Reset the habit tracking for a habit:
 * 1) mark the current active tracking row(s) as failed by setting failure_date to
 *    the current UTC ISO timestamp (toISOString()) and failed = 1
 * 2) insert a new tracking row with start_date set to the same timestamp and failed = 0
 *
 * This keeps a history of the previous run and starts a fresh run for the habit.
 */
export async function resetHabitTracking(
    db: Database,
    habit: TrackedHabit
): Promise<TrackedHabit> {
    if (typeof habit.id !== "number" || Number.isNaN(habit.id))
        throw new Error("habitId must be a valid number");

    const now = new Date().toISOString(); // UTC with trailing Z

    // Mark existing active tracking rows as failed
    await db.execute(
        `UPDATE habit_tracking SET failure_date = $1, failed = 1 WHERE habit_id = $2 AND failed = 0`,
        [now, habit.id]
    );

    // Insert a fresh tracking row (new run)
    await db.execute(
        `INSERT INTO habit_tracking (habit_id, start_date, failed) VALUES ($1, $2, 0)`,
        [habit.id, now]
    );

    const result = await db.select<{ id: number; start_date: Date }[]>(
        `SELECT id, start_date FROM habit_tracking WHERE id = last_insert_rowid()`
    );

    const newTracking: TrackedHabit = {
        id: result[0].id,
        start_date: result[0].start_date,
        habit_id: habit.id,
        icon: habit.icon,
        name: habit.name,
    };

    return newTracking;
}
