<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';
    let { children, class: className = '' }: { children: Snippet; class?: string } = $props();
</script>

<div class={twMerge('flex flex-col', className)}>
    {@render children()}
</div>
