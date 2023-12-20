<script lang="ts">
	import { fadeFly } from '$lib/transitions';
	import { trapFocus } from '$lib/trapfocus';
	import { createEventDispatcher } from 'svelte';
	import XButton from './XButton.svelte';
	import { beforeNavigate } from '$app/navigation';
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
		use:trapFocus
		class="bg-black/30 fixed inset-0 w-full h-full grid place-items-center z-20 text-surface-200"
	>
		<div
			class="bg-surface-800 w-[94dvw] lg:w-auto lg:h-auto mx-auto my-auto shadow flex flex-col rounded relative overflow-auto"
			transition:fadeFly={{
				y: 200,
				duration: 100
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
