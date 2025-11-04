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
};

export type TrackedHabit = {
    id: number;
    name: string;
    icon: string;
    start_date: Date;
};
