<script lang="ts">
    import { icons } from "$lib";
    import { Trash, RotateCcw } from "lucide-svelte";
    import { onMount } from "svelte";

    let {
        icon,
        name,
        start_date,
    }: { icon: string; name: string; start_date: Date } = $props();

    let timeElapsed = $state({ days: 0, hours: 0, minutes: 0 });

    const radius = 84;
    const circumference = 2 * Math.PI * radius;

    let Icon = (
        (icons as Record<string, { icon: any }>)[icon] ||
        (icons as Record<string, { icon: any }>)["smoking"]
    ).icon;

    function updateTimeElapsed() {
        if (!start_date) {
            timeElapsed = { days: 0, hours: 0, minutes: 0 };
            return;
        }

        const start =
            start_date instanceof Date ? start_date : new Date(start_date);
        const now = new Date();
        let diffMs = now.getTime() - start.getTime();
        if (diffMs < 0) diffMs = 0;

        const totalMinutes = Math.floor(diffMs / 60000);
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes - days * 24 * 60) / 60);
        const minutes = totalMinutes % 60;

        timeElapsed = { days, hours, minutes };
    }

    onMount(() => {
        updateTimeElapsed();
        const id = setInterval(updateTimeElapsed, 60_000);
        return () => clearInterval(id);
    });

    $effect(() => {
        if (start_date) updateTimeElapsed();
    });
</script>

<div
    class="bg-white flex flex-col p-4 rounded-lg border place-items-center border-gray-200 shadow-md w-full h-fit gap-8">
    <div class="flex justify-between w-full">
        <div class="flex items-center gap-2 text-sm">
            <span class="bg-sky-100 p-2 rounded-lg">
                <Icon class="size-5 text-sky-600" />
            </span>
            {name}
        </div>
        <button>
            <Trash class="text-gray-300" />
        </button>
    </div>

    <div class="flex flex-col gap-4 items-center">
        <div class="relative w-48 h-48 flex items-center justify-center">
            <div
                class="absolute inset-0 rounded-full border-8 border-slate-100 dark:border-slate-800">
            </div>

            <svg
                class="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 192 192"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true">
                <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="currentColor"
                    stroke-width="8"
                    fill="none"
                    class="text-sky-500 dark:text-sky-600"
                    stroke-dasharray={circumference}
                    stroke-dashoffset={circumference -
                        Math.min(timeElapsed.days * 5, circumference)}
                    stroke-linecap="round" />
            </svg>

            <div class="relative flex flex-col items-center justify-center">
                <div
                    class="text-4xl font-bold text-slate-900 dark:text-slate-100">
                    {timeElapsed.days}
                </div>
                <div class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    days
                </div>
            </div>
        </div>

        <div class="flex gap-2 flex-wrap justify-center">
            <p class="bg-gray-100 rounded-full text-xs w-fit py-1 px-2">
                {timeElapsed.hours}h {timeElapsed.minutes}m
            </p>
            {#if timeElapsed.days >= 7}
                <p
                    class="bg-purple-500 rounded-full text-xs w-fit py-1 px-2 text-neutral-100">
                    {Math.floor(timeElapsed.days / 7)} weeks
                </p>
            {/if}
            {#if timeElapsed.days >= 30}
                <p
                    class="bg-green-500 rounded-full text-xs w-fit py-1 px-2 text-neutral-100">
                    {Math.floor(timeElapsed.days / 30)} months
                </p>
            {/if}
            {#if timeElapsed.days >= 365}
                <p
                    class="bg-sky-500 rounded-full text-xs w-fit py-1 px-2 text-neutral-100">
                    {Math.floor(timeElapsed.days / 365)} years
                </p>
            {/if}

        </div>
    </div>

    <button
        class="border border-destructive text-destructive px-4 py-2 rounded-md hover:bg-red-50 flex justify-center gap-2 w-full">
        <RotateCcw />
        Reset Counter
    </button>
</div>
