<script lang="ts">
    import { page } from "$app/state";
    import "../app.css";
    import { LayoutDashboard, Plus, Settings } from "lucide-svelte";
    import Database from "@tauri-apps/plugin-sql";
    import { onMount, setContext } from "svelte";
    import { type Context } from "$lib";
    import { getAllActiveHabitsNotFailed } from "$lib/db";

    let { children } = $props();
    let currentRoute: string = $derived.by(() => page.url.pathname);
    let context: Context = $state<Context>({
        db: undefined,
        trackedHabits: [],
    });
    setContext<Context>("main", context);

    onMount(async () => {
        const db = await Database.load("sqlite:proficio.db");
        context.db = db;
        const habits = await getAllActiveHabitsNotFailed(db);
        context.trackedHabits = habits;
    });
</script>

<div
    class="relative h-svh w-full overflow-y-auto flex flex-col items-center gap-4 pt-4 px-4 pb-24 bg-gray-100">
    <div class="flex gap-2 flex-col items-center">
        <h1 class="text-2xl font-semibold">Proficio</h1>
        <p>Track your progress, break bad habits</p>
    </div>
    <div class="w-full">
        {@render children()}
    </div>
    <nav
        class="grid grid-cols-3 fixed bottom-0 left-0 right-0 justify-between z-10 w-full h-20 p-2 bg-white border-t border-gray-200">
        <a
            href="/"
            class="flex flex-col place-content-center place-items-center gap-1 w-full h-full rounded-md text-gray-600 hover:text-sky-500 text-sm {currentRoute ===
            '/'
                ? 'bg-sky-200 text-sky-600'
                : ''}">
            <LayoutDashboard class="size-4" />
            <span>Dashboard</span>
        </a>
        <a
            href="/add"
            class="flex flex-col place-content-center place-items-center gap-1 w-full h-full rounded-md text-gray-600 hover:text-sky-500 text-sm text-nowrap {currentRoute ===
            '/add'
                ? 'bg-sky-200 text-sky-600'
                : ''}">
            <Plus class="size-4" />
            <span>Add Habit</span>
        </a>
        <a
            href="/contact"
            class="flex flex-col place-content-center place-items-center gap-1 w-full h-full rounded-md text-gray-600 hover:text-sky-500 text-sm {currentRoute ===
            '/contact'
                ? 'bg-sky-200 text-sky-600'
                : ''}">
            <Settings class="size-4" />
            <span>Settings</span>
        </a>
    </nav>
</div>
