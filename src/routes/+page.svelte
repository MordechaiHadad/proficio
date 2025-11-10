<script lang="ts">
    import { Result, type Context, type TrackedHabit } from "$lib";
    import HabitCard from "$lib/components/HabitCard.svelte";
    import { getContext } from "svelte";
    import AlertDialog from "$lib/sveltlana/components/AlertDialog/index.js";
    import { deleteHabitById, resetHabitTracking } from "$lib/db";
    import { Clipboard } from "lucide-svelte";

    let context = getContext<Context>("main");
    let deleteDialogOpen = $state(false);
    let resetDialogOpen = $state(false);
    let currentHabit = $state<TrackedHabit | null>(null);
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 size-full">
    {#if context.trackedHabits && context.trackedHabits.length > 0}
        {#each context.trackedHabits as habit}
            <HabitCard
                icon={habit.icon}
                name={habit.name}
                start_date={habit.start_date}
                ondelete={() => {
                    currentHabit = {
                        ...currentHabit!,
                        id: habit.id,
                        name: habit.name,
                        habit_id: habit.habit_id,
                    };
                    deleteDialogOpen = true;
                }}
                onreset={() => {
                    currentHabit = {
                        ...currentHabit!,
                        id: habit.id,
                        name: habit.name,
                        habit_id: habit.habit_id,
                    };
                    resetDialogOpen = true;
                }} />
        {/each}
    {:else}
        <div class="flex flex-col gap-2 place-items-center text-center mt-16 dark:text-neutral-100">
            <Clipboard class="size-20 text-gray-400" />
            <p>No habits yet</p>
            <p class="text-gray-600 text-sm">
                Start tracking your progress by adding a habit
            </p>
        </div>
    {/if}
</div>

<AlertDialog
    bind:isOpen={deleteDialogOpen}
    oncancel={() => (currentHabit = null)}
    onconfirm={async () => {
        const result = await deleteHabitById(
            context.db!,
            currentHabit!.habit_id
        );
        if (result === Result.Ok)
            context.trackedHabits = context.trackedHabits.filter(
                (h) => h.habit_id !== currentHabit!.habit_id
            );
    }}
    class="backdrop:backdrop-blur-xs transition-discrete open:starting:opacity-0 open:starting:scale-95 w-[90%] max-w-2xl scale-95 flex-col gap-4 place-self-center rounded-md bg-neutral-100 px-4 py-6 opacity-0 shadow transition-all duration-200 ease-in-out open:flex open:scale-100 open:opacity-100">
    <AlertDialog.Header class="flex flex-col gap-2 place-items-center">
        <AlertDialog.Title class="font-bold text-neutral-900"
            >Delete habit?</AlertDialog.Title>
        <AlertDialog.Description class="text-sm text-gray-600 text-center"
            >This will permanently delete "{currentHabit?.name}" and all its
            progress. This action cannot be undone.</AlertDialog.Description>
    </AlertDialog.Header>

    <AlertDialog.Footer class="flex gap-2 justify-start flex-col sm:flex-row-reverse">
        <AlertDialog.Confirm
            class="text-center inline bg-destructive text-neutral-100 rounded p-1 sm:px-4 hover:bg-destructive/80"
            >Delete</AlertDialog.Confirm>
        <AlertDialog.Cancel
            class="text-center inline bg-neutral-100 text-neutral-900 rounded p-1 sm:px-4 border border-gray-200 hover:bg-neutral-200"
            >Cancel</AlertDialog.Cancel>
    </AlertDialog.Footer>
</AlertDialog>

<AlertDialog
    oncancel={() => (currentHabit = null)}
    onconfirm={async () => {
        const result = await resetHabitTracking(context.db!, currentHabit!);

        context.trackedHabits = context.trackedHabits.map((h) =>
            h.habit_id === currentHabit!.habit_id ? { ...h, ...result } : h
        );
    }}
    bind:isOpen={resetDialogOpen}
    class="backdrop:backdrop-blur-xs transition-discrete open:starting:opacity-0 open:starting:scale-95 w-[90%] max-w-2xl scale-95 flex-col gap-4 place-self-center rounded-md bg-neutral-100 px-4 py-6 opacity-0 shadow transition-all duration-200 ease-in-out open:flex open:scale-100 open:opacity-100">
    <AlertDialog.Header class="flex flex-col gap-2 place-items-center">
        <AlertDialog.Title class="font-bold text-neutral-900"
            >Reset counter?</AlertDialog.Title>
        <AlertDialog.Description class="text-sm text-gray-600 text-center"
            >This will reset your progress for "{currentHabit?.name}" back to 0
            days. Are you sure you want to continue?</AlertDialog.Description>
    </AlertDialog.Header>

    <AlertDialog.Footer class="flex gap-2 justify-start flex-col sm:flex-row-reverse">
        <AlertDialog.Confirm
            class="text-center inline bg-destructive text-neutral-100 rounded p-1 sm:px-4 hover:bg-destructive/80"
            >Reset</AlertDialog.Confirm>
        <AlertDialog.Cancel
            class="text-center inline bg-neutral-100 text-neutral-900 rounded p-1 sm:px-4 border border-gray-200 hover:bg-neutral-200"
            >Cancel</AlertDialog.Cancel>
    </AlertDialog.Footer>
</AlertDialog>
