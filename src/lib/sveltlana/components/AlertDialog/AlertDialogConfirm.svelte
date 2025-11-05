<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { getContext, type Snippet } from 'svelte';
	import type { Context } from './context';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();

	const context = getContext('alertdialog') as Context;

	const handleClick = () => {
		context.onConfirm?.();
	};
</script>

<button type="button" class={twMerge('inline-flex items-center', className)} onclick={handleClick}>
	{@render children()}
</button>
