<script lang="ts">
	import createPopperAction from '$lib/popover';
	import { cn } from '$lib/utils';
	import type { User } from 'lucia';
	import { fade } from 'svelte/transition';

	export let disabled: boolean | undefined = undefined;
	export let loading: boolean;
	export let user: User | undefined;

	interface $$restProps {
		class: string;
	}

	let tooltipOpen = false;
	let timeout: NodeJS.Timeout | undefined = undefined;

	const [usePopperTrigger, usePopperContent] = createPopperAction();

	$: {
		if (tooltipOpen) {
			if (timeout) {
				clearInterval(timeout);
			}
			timeout = setTimeout(() => {
				tooltipOpen = false;
			}, 2000);
		}
	}
</script>

<button
	use:usePopperTrigger
	on:click={(e) => {
		if (!user) {
			tooltipOpen = true;
			e.preventDefault();
		}
	}}
	{disabled}
	formaction="/create?/draft"
	type="submit"
	class={cn(
		'flex flex-row gap-1 items-center justify-center w-full py-2 rounded-sm font-medium text-surface-50 bg-surface-700 outline-none transition focus-visible:ring-1 disabled:opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 focus-visible:ring-surface-500 enabled:hover:text-white enabled:hover:bg-surface-600',
		$$restProps.class
	)}
>
	{#if loading}
		Saving...
	{:else}
		Save as draft
	{/if}
</button>
{#if tooltipOpen}
	<div
		role="tooltip"
		transition:fade={{ duration: 300 }}
		use:usePopperContent={{
			params: {
				placement: 'top',
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [0, 5]
						}
					}
				]
			}
		}}
		class="py-2 px-4 text-surface-50 text-sm rounded bg-neutral-700 shadow relative"
	>
		Sign in to use this function
		<div
			class="invisible before:absolute before:w-3 before:h-3 before:bg-inherit w-3 h-3 bg-inherit absolute before:visible before:content-[''] before:rotate-45 bottom-[-2px]"
			data-popper-arrow
		></div>
	</div>
{/if}
