import type { TrackedHabit } from "$lib";
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
        const lastRow = await db.select<{ id: number; start_date: Date }[]>(
            `SELECT id, start_date FROM habit_tracking WHERE id = last_insert_rowid()`
        );

        return {
            id: lastRow[0].id,
            name,
            icon,
            start_date: lastRow[0].start_date
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
        }[]
    >(`
        SELECT
          ht.id as id,
          h.name as name,
          h.icon as icon,
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
    }));
}