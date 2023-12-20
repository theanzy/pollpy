<script lang="ts">
	import { fadeFly } from '$lib/transitions';
	import { trapFocus } from '$lib/trapfocus';
	import { createEventDispatcher } from 'svelte';
	import XButton from './XButton.svelte';
	import Portal from './Portal.svelte';
	export let open = false;
	export let closeButton = false;

	const dispatch = createEventDispatcher<{ close: void }>();
	const handleClose = () => {
		dispatch('close');
		open = false;
	};
</script>

<svelte:body
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			handleClose();
		}
	}}
/>
{#if open}
	<Portal target="#mainLayout">
		<div
			use:trapFocus
			style="position: fixed; top:0; bottom:0;"
			class="bg-black/30 fixed inset-0 w-full h-full grid place-items-center z-10"
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
	</Portal>
{/if}
