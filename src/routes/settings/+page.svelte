<script lang="ts">
    import type { Context } from "$lib";
    import ToggleSwitch from "$lib/components/ToggleSwitch.svelte";
    import { Moon, Sun } from "lucide-svelte";
    import { getContext } from "svelte";

    let context = getContext<Context>("main");
</script>

<div
    class="flex flex-col bg-white rounded-lg border border-gray-200 p-6 shadow-md gap-4">
    <div class="flex flex-col gap-1">
        <h2>Settings</h2>
        <p class="text-gray-600 text-sm">
            Manage your preferences and app settings
        </p>
    </div>
    <div class="flex flex-col gap-1">
        <p>Appearance</p>
        <div
            class="flex justify-between items-center bg-gray-50 rounded-lg p-4 text-sm border border-gray-200">
            <div class="flex gap-2">
                <span class="p-2 bg-gray-200 rounded-lg text-gray-600">
                    {#if context.isDarkMode}
                        <Moon></Moon>
                    {:else}
                        <Sun></Sun>
                    {/if}
                </span>
                <div class="flex flex-col">
                    <p>Dark Mode</p>
                    <p class="text-gray-600">
                        {context.isDarkMode ? "Enabled" : "Disabled"}
                    </p>
                </div>
            </div>
            <ToggleSwitch bind:checked={context.isDarkMode} class="focus:ring-0" checkedClass="bg-blue-500 dark:bg-white" thumbClass="bg-white dark:bg-neutral-900" ontoggle={(toggled: boolean) => (context.isDarkMode = toggled)} />
        </div>
    </div>
    <div class="border-b border-gray-300"></div>
    <div class="flex flex-col gap-1">
        <p>About</p>
        <div
            class="flex justify-between items-center bg-gray-50 rounded p-2 text-sm">
            <p>Version</p>
            <p>1.0.0</p>
        </div>
    </div>
    <div class="flex flex-col mt-4 gap-1">
        <p class="font-semibold">Tips</p>
        <ul
            class="list-disc list-inside text-sm text-gray-600 flex flex-col gap-1">
            <li>Track your progress daily to stay motivated</li>
            <li>Be honest when you need to reset a counter</li>
            <li>Celebrate your milestones, no matter how small</li>
            <li>Your data is saved locally on your device</li>
        </ul>
    </div>
</div>
