<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface $$Props extends HTMLButtonAttributes {}
</script>

<button
	{...$$restProps}
	on:click
	type="button"
	class={cn(
		'rounded-full p-1 transition outline-none hover:text-primary-700 focus-visible:ring-2 ring-offset-surface-950 ring-primary-700',
		$$restProps.class
	)}
>
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
		/>
	</svg>
</button>
