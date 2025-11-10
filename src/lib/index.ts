import type Database from "@tauri-apps/plugin-sql";
import {
    BeerOff,
    CandyOff,
    CigaretteOff,
    Dumbbell,
    Gamepad2Icon,
    Pizza,
    ScreenShareOff,
} from "lucide-svelte";

export const icons = {
    smoking: {
        name: "Smoking",
        icon: CigaretteOff,
    },
    drinking: {
        name: "Drinking",
        icon: BeerOff,
    },
    exercise: {
        name: "Exercise",
        icon: Dumbbell,
    },
    sugar: {
        name: "Sugar",
        icon: CandyOff,
    },
    gaming: {
        name: "Gaming",
        icon: Gamepad2Icon,
    },
    screens: {
        name: "Screen Time",
        icon: ScreenShareOff,
    },
    fast_food: {
        name: "Fast Food",
        icon: Pizza,
    },
};

export type Context = {
    db?: Database;
    trackedHabits: TrackedHabit[];
    isDarkMode: boolean;
};

export type TrackedHabit = {
    id: number;
    name: string;
    icon: string;
    start_date: Date;
    habit_id: number;
};

export enum Result {
    Ok,
    Err,
}

export type HabitExportRow = {
    habit_name: string;
    start_date: string;
    failure_date: string;
    days_lasted: number;
};

export function generateCSV(
    headers: (keyof HabitExportRow)[],
    rows: HabitExportRow[]
): string {
    function regularCase(key: string) {
        return key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    const csvContent = [
        headers.map((h) => regularCase(String(h))).join(","),
        ...rows.map((row) =>
            headers
                .map((header) => {
                    const cell = row[header] ?? "";
                    const escaped = String(cell).replace(/"/g, '""');
                    return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
                })
                .join(",")
        ),
    ].join("\n");

    return csvContent;
}
