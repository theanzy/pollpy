<script lang="ts">
	import Modal from './Modal.svelte';

	export let slug: string;

	let openModal = false;
</script>

<button
	on:click={() => {
		openModal = true;
	}}
	type="button"
	class="flex flex-row gap-2 items-center text-rose-500"
>
	<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
		/></svg
	>
	Delete
</button>

{#if openModal}
	<Modal bind:open={openModal} closeButton>
		<h2 class="pt-4 px-5 font-medium flex flex-row gap-2 items-center text-lg">
			<svg
				class="w-5 h-5"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<g fill="none"
					><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" /><path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-width="1.5"
						d="M12 7v6"
					/><circle cx="12" cy="16" r="1" fill="currentColor" /></g
				>
			</svg>
			Delete Poll
		</h2>

		<form></form>
	</Modal>
{/if}
