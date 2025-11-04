<script lang="ts">
    import type { Context } from "$lib";
    import HabitCard from "$lib/components/HabitCard.svelte";
    import { getContext } from "svelte";

    let context = getContext<Context>("main");
</script>

<div class="grid grid-cols-1 gap-4 size-full">
    {#each context.trackedHabits as habit}
        <HabitCard icon={habit.icon} name={habit.name} start_date={habit.start_date} />
    {/each}
</div>
