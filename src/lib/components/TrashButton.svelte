<script lang="ts">
	import createPopperAction from '$lib/popover';
	import { fade } from 'svelte/transition';
	let tooltipOpen = false;
	const [usePopperTrigger, usePopperContent] = createPopperAction();
</script>

<button
	on:click
	class="p-1 text-surface-300 hover:text-primary-600 rounded-full outline-none focus-visible:ring-1 transition ring-primary-500"
	use:usePopperTrigger
	on:mouseenter={() => {
		tooltipOpen = true;
	}}
	on:mouseleave={() => {
		tooltipOpen = false;
	}}
>
	<svg
		class="w-6 h-6"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<path
			fill="currentColor"
			d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
		/>
	</svg>
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
							offset: [0, 2]
						}
					}
				]
			}
		}}
		class="py-2 px-3 text-surface-50 text-sm rounded bg-neutral-700 shadow relative"
	>
		Delete
		<div
			class="invisible before:absolute before:w-3 before:h-3 before:bg-inherit w-3 h-3 bg-inherit absolute before:visible before:content-[''] before:rotate-45 bottom-[-2px]"
			data-popper-arrow
		></div>
	</div>
{/if}
