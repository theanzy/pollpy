<script lang="ts">
	import { clickOutside } from '$lib/clickoutside';
	import { createEventDispatcher, onMount } from 'svelte';
	import FileDropArea from './FileDropArea.svelte';

	import Modal from './Modal.svelte';

	const dispatch = createEventDispatcher<{
		upload: File;
	}>();

	export let open = false;
	let files: File[] | null = null;
	$: {
		const file = files?.[0];
		if (file) {
			dispatch('upload', file);
			open = false;
			files = null;
		}
	}
</script>

<Modal bind:open closeButton>
	<div
		class="min-w-[500px] border border-surface-800"
		use:clickOutside={() => {
			open = false;
		}}
	>
		<h3 class="mt-3 mx-6 text-lg text-surface-50 font-medium">Upload File</h3>
		<hr class="border border-transparent border-b-surface-700 my-4" />
		<div class="px-6 mb-5">
			<FileDropArea bind:files />
			<button
				on:click={() => {
					open = false;
				}}
				class="mt-5 px-10 py-2 font-medium outline-none rounded-sm bg-secondary-600 text-surface-100 transition hover:bg-secondary-700 hover:text-surface-50 focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 ring-secondary-600"
			>
				Cancel
			</button>
		</div>
	</div>
</Modal>
