<script lang="ts">
    import { icons, type Context } from "$lib";
    import { createNewHabit } from "$lib/db";
    import {
        Check,
    } from "lucide-svelte";
    import { getContext } from "svelte";

    let context = getContext<Context>("main");

    let currentIcon = $state("smoking");
    let habitName = $state("");
    let disabled = $derived(habitName.length === 0);
</script>

<div
    class="flex flex-col w-full bg-white rounded-lg border border-gray-200 p-4 shadow-md gap-4">
    <div class="flex flex-col gap-0.5">
        <p class="text-sm">Add New Habit</p>
        <p class="text-sm text-gray-500">
            Create a new habit to track your progress
        </p>
    </div>
    <div class="flex flex-col gap-0.5">
        <label
            for="habit-name"
            class="block text-sm font-medium text-gray-700 mb-1">
            Habit Name
        </label>
        <input
            type="text"
            bind:value={habitName}
            id="habit-name"
            class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all ease-in-out duration-200"
            placeholder="e.g., Read a book daily" />
    </div>
    <div class="flex flex-col gap-0.5 @container">
        <p>Choose an Icon</p>
        <div class="grid grid-cols-2 @sm:grid-cols-3 gap-4">
            {#each Object.entries(icons) as [key, { name, icon: Icon }]}
                <button
                    onclick={() => (currentIcon = key)}
                    class="flex flex-col items-center gap-2 border text-gray-600 border-gray-300 rounded-md px-2 py-4 hover:bg-sky-100 transition-all ease-in-out duration-200 relative {currentIcon ===
                    key
                        ? 'bg-sky-100 border-sky-500 text-sky-600'
                        : ''}">
                    <Icon class="size-5" />
                    <span>{name}</span>
                    <Check
                        class="size-4 text-white bg-sky-500 rounded-full p-0.5 absolute -top-2 -right-2 {currentIcon ===
                        key
                            ? 'block'
                            : 'hidden'}" />
                </button>
            {/each}
        </div>
    </div>
    <button
        onclick={async () => {
            const habit = await createNewHabit(context.db!, habitName, currentIcon, "");
            context.trackedHabits = [...context.trackedHabits, habit];
        }}
        {disabled}
        class="text-neutral-100 bg-sky-600 hover:bg-sky-700 rounded-md p-2 disabled:bg-sky-300"
        >Add Habit</button>
</div>
