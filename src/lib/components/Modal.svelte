<script lang="ts">
	import { browser } from '$app/environment';

	import { trapFocus } from '$lib/trapfocus';
	import { createEventDispatcher } from 'svelte';
	import XButton from './XButton.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { fly } from 'svelte/transition';
	export let open = false;
	export let closeButton = false;

	const dispatch = createEventDispatcher<{ close: void }>();
	const handleClose = () => {
		dispatch('close');
		open = false;
	};
	beforeNavigate(() => {
		open = false;
	});

	function useHideOverflowY(elem: HTMLDivElement) {
		if (elem) {
			document.body.style.overflowY = 'hidden';
		}
	}
	$: if (!open) {
		if (browser) {
			document.body.style.overflowY = 'auto';
		}
	}
</script>

<svelte:body
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			handleClose();
		}
	}}
/>
{#if open}
	<div
		use:useHideOverflowY
		use:trapFocus
		class="bg-black/30 fixed inset-0 w-full h-full grid place-items-center z-20 text-surface-200"
	>
		<div
			class="bg-surface-800 border border-surface-700 w-[94dvw] lg:w-auto lg:h-auto mx-auto my-auto shadow flex flex-col rounded relative overflow-auto"
			transition:fly={{
				duration: 200,
				opacity: 0.1,
				y: 5
			}}
		>
			{#if closeButton}
				<XButton
					aria-label="close modal"
					class="absolute top-2 right-2 z-10"
					on:click={handleClose}
				/>
			{/if}
			<slot />
		</div>
	</div>
{/if}
