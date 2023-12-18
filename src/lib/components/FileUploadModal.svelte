<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import toast from 'svelte-french-toast';

	import { clickOutside } from '$lib/clickoutside';
	import FileDropArea from './FileDropArea.svelte';
	import Modal from './Modal.svelte';

	export let open = false;
	let loading = false;
	let controller: AbortController | null = null;

	const dispatch = createEventDispatcher<{
		upload: string;
	}>();

	const handleCloseModal = () => {
		if (loading && controller) {
			console.log('aborting');
			if (controller.signal.aborted === false) {
				controller.abort();
			}
		}
		open = false;
	};

	async function handleUpload(e: CustomEvent<File>) {
		if (loading) {
			return;
		}
		loading = true;
		try {
			const formdata = new FormData();
			formdata.append('file', e.detail);
			controller = new AbortController();
			const signal = controller.signal;
			const res = await fetch('/upload/image', {
				body: formdata,
				method: 'POST',
				signal
			});
			const data: {
				error?: string;
				url?: string;
			} = await res.json();
			if (data.error) {
				toast.error(data.error);
			} else if (data.url) {
				dispatch('upload', data.url);
			}
			open = false;
		} catch (error) {
			console.log('error upload file /upload/image', error);
			if (error instanceof DOMException) {
				toast.error('Upload cancelled');
			} else {
				toast.error('Fail to upload image');
			}
		} finally {
			loading = false;
		}
	}
</script>

<Modal bind:open closeButton on:close={handleCloseModal}>
	<div class="min-w-[500px] border border-surface-800" use:clickOutside={handleCloseModal}>
		<h3 class="mt-3 mx-6 text-lg text-surface-50 font-medium">Upload File</h3>
		<hr class="border border-transparent border-b-surface-700 my-4" />
		<div class="px-6 mb-5">
			<FileDropArea on:upload={handleUpload} disabled={loading} />
			<button
				disabled={loading}
				on:click={handleCloseModal}
				class="mt-5 px-10 py-2 font-medium outline-none rounded-sm bg-secondary-600 text-surface-100 transition enabled:hover:bg-secondary-700 enabled:hover:text-surface-50 enabled:focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 ring-secondary-600 disabled:opacity-50"
			>
				Cancel
			</button>
		</div>
	</div>
</Modal>
