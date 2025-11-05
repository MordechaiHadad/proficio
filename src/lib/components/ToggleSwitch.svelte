<script>
	import { twMerge } from 'tailwind-merge';

	let { checked = $bindable(false), ontoggle, class: className = '', checkedClass = 'bg-blue-600', uncheckedClass = 'bg-gray-300', thumbClass = 'bg-white', disabled = false } = $props();

	function handleToggle() {
		if (disabled) return;
		checked = !checked;
		ontoggle?.(checked);
	}
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	aria-label="Toggle switch"
	onclick={handleToggle}
	{disabled}
	class={twMerge('relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50', checked ? checkedClass : uncheckedClass, className)}
>
	<span
		class={twMerge('inline-block h-4 w-4 transform rounded-full transition-transform', checked ? 'translate-x-6' : 'translate-x-1', thumbClass)}
	></span>
</button>
