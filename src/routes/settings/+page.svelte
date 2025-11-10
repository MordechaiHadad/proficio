<script lang="ts">
    import {
        generateCSV,
        type Context,
        type HabitExportRow,
        type TrackedHabit,
    } from "$lib";
    import ToggleSwitch from "$lib/components/ToggleSwitch.svelte";
    import { getAllTrackedHabits, setDarkMode } from "$lib/db";
    import { getVersion } from "@tauri-apps/api/app";
    import { message, save } from "@tauri-apps/plugin-dialog";
    import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
    import { Download, Moon, Sun } from "lucide-svelte";
    import { getContext, onMount } from "svelte";

    let context = getContext<Context>("main");
    let version = $state("");
    onMount(async () => {
        version = await getVersion();
    });
</script>

<div
    class="flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:text-neutral-100 dark:border-gray-700 p-6 shadow-md gap-4">
    <div class="flex flex-col gap-1">
        <h2>Settings</h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
            Manage your preferences and app settings
        </p>
    </div>
    <div class="flex flex-col gap-1">
        <p>Appearance</p>
        <div
            class="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm border border-gray-200 dark:border-gray-700">
            <div class="flex gap-2">
                <span
                    class="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
                    {#if context.isDarkMode}
                        <Moon></Moon>
                    {:else}
                        <Sun></Sun>
                    {/if}
                </span>
                <div class="flex flex-col">
                    <p>Dark Mode</p>
                    <p class="text-gray-600 dark:text-gray-400">
                        {context.isDarkMode ? "Enabled" : "Disabled"}
                    </p>
                </div>
            </div>
            <ToggleSwitch
                bind:checked={context.isDarkMode}
                class="focus:ring-0"
                checkedClass="bg-blue-500 dark:bg-white"
                thumbClass="bg-white dark:bg-neutral-900"
                ontoggle={async (toggled: boolean) => {
                    context.isDarkMode = toggled;
                    await setDarkMode(context.db!, toggled);
                }} />
        </div>
    </div>
    <div class="border-b border-gray-300 dark:border-gray-700"></div>
    <div class="flex flex-col gap-1">
        <p>Data Management</p>
        <div
            class="flex justify-between sm:items-center bg-gray-50 dark:bg-gray-700 rounded-lg gap-2 p-4 text-sm border border-gray-200 dark:border-gray-700">
            <div class="flex flex-col">
                <p>Export Habits</p>
                <p class="text-gray-600 dark:text-gray-400">
                    Download your habit tracking data as a CSV file
                </p>
            </div>
            <button
                onclick={async () => {
                    const result = await getAllTrackedHabits(context.db!);
                    const rows: HabitExportRow[] = result.map((habit) => {
                        const start = habit.start_date;
                        const end = habit.failure_date || new Date();
                        const diffMs = end.getTime() - start.getTime();
                        return {
                            habit_name: habit.name,
                            start_date:
                                habit.start_date.toLocaleDateString() +
                                " " +
                                habit.start_date.toLocaleTimeString(),
                            failure_date: habit.failure_date
                                ? `${habit.failure_date.toLocaleDateString()} ${habit.failure_date.toLocaleTimeString()}`
                                : "",
                            days_lasted: Math.floor(
                                diffMs / (1000 * 60 * 60 * 24)
                            ),
                        };
                    });
                    const headers: (keyof HabitExportRow)[] = [
                        "habit_name",
                        "start_date",
                        "failure_date",
                        "days_lasted",
                    ];
                    const csvContent = generateCSV(headers, rows);
                    const fileName = `proficio_habit_export_${new Date()
                        .toISOString()
                        .slice(0, 10)}.csv`;

                    const path = await save({
                        defaultPath: fileName,
                        filters: [
                            {
                                name: "CSV Files",
                                extensions: ["csv"],
                            },
                        ],
                    });
                    if (!path) return;

                    await writeTextFile(path, csvContent, {
                        baseDir: BaseDirectory.Download,
                    });
                }}
                class="py-1 px-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nowrap h-fit inline-flex items-center gap-2 rounded-md text-xs hover:bg-gray-100 dark:hover:bg-gray-600 transition-all ease-in-out duration-200">
                <Download class="size-4" />
                Export CSV
            </button>
        </div>
    </div>
    <div class="border-b border-gray-300 dark:border-gray-700"></div>
    <div class="flex flex-col gap-2">
        <p>About</p>
        <div
            class="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded p-2 text-sm">
            <p>Version</p>
            <p>{version}</p>
        </div>
        <div
            class="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded p-2 text-sm">
            <p>Data Storage</p>
            <p>Local</p>
        </div>
    </div>
    <div class="flex flex-col mt-4 gap-1">
        <p class="font-semibold">Tips</p>
        <ul
            class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-1">
            <li>Track your progress daily to stay motivated</li>
            <li>Be honest when you need to reset a counter</li>
            <li>Celebrate your milestones, no matter how small</li>
            <li>Your data is saved locally on your device</li>
        </ul>
    </div>
</div>
