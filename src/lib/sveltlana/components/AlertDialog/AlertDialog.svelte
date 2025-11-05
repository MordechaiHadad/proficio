<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import type { Context } from './context';

	let {
		isOpen = $bindable(false),
		onconfirm = () => {},
		oncancel = () => {},
		children,
		class: className = ''
	}: {
		isOpen?: boolean;
		onconfirm?: () => void;
		oncancel?: () => void;
		children: Snippet;
		class?: string;
	} = $props();

	let dialog: HTMLDialogElement | null;

	const handleConfirm = () => {
		onconfirm?.();
		isOpen = false;
		dialog?.close();
	};

	const handleCancel = () => {
		oncancel?.();
		isOpen = false;
		dialog?.close();
	};

	$effect(() => {
		if (isOpen) dialog?.showModal();
		else dialog?.close();
	});

	let context: Context = $state({ onConfirm: handleConfirm, onCancel: handleCancel });

	setContext('alertdialog', context);
</script>

<dialog bind:this={dialog} class={className}>
	{@render children()}
</dialog>
