<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface $$Props extends HTMLInputAttributes {
		name: string;
	}
	export let value: string | undefined = undefined;

	let el: HTMLInputElement;
	export function focus() {}
</script>

<input
	{...$$restProps}
	bind:this={el}
	bind:value
	class={cn(
		'rounded-sm bg-surface-700 text-surface-100 px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 ring-offset-surface-900 placeholder:text-surface-400',
		$$restProps.class
	)}
/>
