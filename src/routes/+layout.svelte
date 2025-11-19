<script lang="ts">
    import { page } from "$app/state";
    import "../app.css";
    import { LayoutDashboard, Plus, Settings } from "lucide-svelte";
    import Database from "@tauri-apps/plugin-sql";
    import { onMount, setContext } from "svelte";
    import { type Context } from "$lib";
    import { platform } from '@tauri-apps/plugin-os';

    let { children, data } = $props();
    let currentRoute: string = $derived.by(() => page.url.pathname);
    let context: Context = $state<Context>({
        db: undefined,
        trackedHabits: [],
        isDarkMode: false,
    });
    const currentPlatform = platform();
    setContext<Context>("main", context);

    $effect(() => {
        if (context.isDarkMode) document.body.classList.add("dark");
        else document.body.classList.remove("dark");
    });

    if (data?.settings) context.isDarkMode = data.settings.isDarkMode;
    else
        context.isDarkMode =
            window?.matchMedia("(prefers-color-scheme: dark)")?.matches ??
            false;

    if (data?.habits) context.trackedHabits = data.habits;

    onMount(async () => {
        const db = await Database.load("sqlite:proficio.db");
        context.db = db;

        if (!data?.settings) {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            mediaQuery.addEventListener("change", (e) => {
                context.isDarkMode = e.matches;
            });
        }
    });
</script>

<div
    class="relative min-h-dvh w-full overflow-y-auto flex flex-col items-center gap-4 {currentPlatform === 'android' || currentPlatform === 'ios' ? 'pt-16 pb-31' : 'pt-4'} md:pt-16 md:gap-8 px-4 bg-gray-100 dark:bg-gray-900">
    <div class="flex gap-2 flex-col items-center">
        <h1 class="text-2xl font-semibold dark:text-neutral-100">Proficio</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
            Track your progress, break bad habits
        </p>
    </div>
    <nav
        class="hidden lg:grid grid-cols-3 gap-1 bg-neutral-200/30 dark:bg-gray-800 rounded-lg p-1">
        <a
            href="/"
            class="flex place-content-center place-items-center py-2 px-4 gap-1 w-full h-full rounded-md text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-blue-500 text-sm {currentRoute ===
            '/'
                ? 'dark:text-blue-500! text-sky-600 bg-white dark:bg-gray-900'
                : ''}">
            <LayoutDashboard class="size-4" />
            <span>Dashboard</span>
        </a>
        <a
            href="/add"
            class="flex place-content-center place-items-center py-2 px-4 gap-1 w-full h-full rounded-md text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-blue-500 text-sm {currentRoute ===
            '/add'
                ? 'dark:text-blue-500! text-sky-600 bg-white dark:bg-gray-900'
                : ''}">
            <Plus class="size-4" />
            <span>Add Habit</span>
        </a>
        <a
            href="/settings"
            class="flex place-content-center place-items-center gap-1 py-2 px-4 w-full h-full rounded-md text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-blue-500 text-sm {currentRoute ===
            '/settings'
                ? 'dark:text-blue-500! text-sky-600 bg-white dark:bg-gray-900'
                : ''}">
            <Settings class="size-4" />
            <span>Settings</span>
        </a>
    </nav>
    <div class="w-full max-w-5xl">
        {@render children()}
    </div>
    <nav
        class="grid grid-cols-3 fixed {currentPlatform === 'android' || currentPlatform === 'ios' ? 'bottom-3' : 'bottom-0'} left-0 right-0 justify-between z-10 w-full h-20 p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden">
        <a
            href="/"
            class="flex flex-col place-content-center place-items-center gap-1 w-full h-full rounded-md text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-blue-500 text-sm {currentRoute ===
            '/'
                ? 'bg-sky-200 dark:text-blue-500! text-sky-600 dark:bg-blue-900'
                : ''}">
            <LayoutDashboard class="size-4" />
            <span>Dashboard</span>
        </a>
        <a
            href="/add"
            class="flex flex-col place-content-center place-items-center gap-1 w-full h-full rounded-md text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-blue-500 text-sm {currentRoute ===
            '/add'
                ? 'bg-sky-200 dark:text-blue-500! text-sky-600 dark:bg-blue-900'
                : ''}">
            <Plus class="size-4" />
            <span>Add Habit</span>
        </a>
        <a
            href="/settings"
            class="flex flex-col place-content-center place-items-center gap-1 w-full h-full rounded-md text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-blue-500 text-sm {currentRoute ===
            '/settings'
                ? 'bg-sky-200 dark:text-blue-500! text-sky-600 dark:bg-blue-900'
                : ''}">
            <Settings class="size-4" />
            <span>Settings</span>
        </a>
    </nav>
</div>
