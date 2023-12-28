<script lang="ts">
	import { page } from '$app/stores';
	import { sharePollModalStore } from '$lib/modalStore';
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	export let slug = '';
	$: pollLink = `${$page.url.origin}/${slug}`;

	const dispatch = createEventDispatcher<{
		click: void;
	}>();
</script>

<button
	type="button"
	on:click={() => {
		dispatch('click');
		sharePollModalStore.openModal({
			link: pollLink
		});
	}}
	class={cn(
		'text-sm flex flex-row gap-2 justify-center items-center bg-surface-900 border border-surface-600 text-surface-50 px-4 py-2 rounded-sm outline-none transition enabled:hover:text-white enabled:hover:bg-surface-800 ring-offset-2 ring-offset-surface-950 focus-visible:ring-1 ring-surface-400',
		$$restProps.class
	)}
>
	<svg
		class="w-5 h-5"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<path
			fill="currentColor"
			d="M18 22q-1.25 0-2.125-.875T15 19q0-.175.025-.363t.075-.337l-7.05-4.1q-.425.375-.95.588T6 15q-1.25 0-2.125-.875T3 12q0-1.25.875-2.125T6 9q.575 0 1.1.213t.95.587l7.05-4.1q-.05-.15-.075-.337T15 5q0-1.25.875-2.125T18 2q1.25 0 2.125.875T21 5q0 1.25-.875 2.125T18 8q-.575 0-1.1-.212t-.95-.588L8.9 11.3q.05.15.075.338T9 12q0 .175-.025.363T8.9 12.7l7.05 4.1q.425-.375.95-.587T18 16q1.25 0 2.125.875T21 19q0 1.25-.875 2.125T18 22m0-16q.425 0 .713-.287T19 5q0-.425-.288-.712T18 4q-.425 0-.712.288T17 5q0 .425.288.713T18 6M6 13q.425 0 .713-.288T7 12q0-.425-.288-.712T6 11q-.425 0-.712.288T5 12q0 .425.288.713T6 13m12 7q.425 0 .713-.288T19 19q0-.425-.288-.712T18 18q-.425 0-.712.288T17 19q0 .425.288.713T18 20m0-1"
		/>
	</svg>
	Share
</button>
