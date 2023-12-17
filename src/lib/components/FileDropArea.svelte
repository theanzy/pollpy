<script lang="ts">
	import { dropfiles } from '$lib/dropfiles';
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import toast from 'svelte-french-toast';

	export let disabled = false;
	let dragging = false;
	let files: File[] | null = null;
	let acceptFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
	const fileSizeMB = 4;
	const fileSizeLimit = fileSizeMB * (1024 * 1024);

	const dispatch = createEventDispatcher<{
		upload: File;
	}>();
	$: {
		if (files?.[0]) {
			dispatch('upload', files[0]);
		}
	}

	function handleDropFiles(droppedFiles: File[] | null, err?: Error) {
		if (disabled) {
			return;
		}
		if (err) {
			toast.error(err.message);
		} else {
			files = droppedFiles;
		}
		dragging = false;
	}

	function handleUploadFile(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		if (disabled) {
			return;
		}
		const target = e.target as HTMLInputElement;
		if (!target.files) {
			return;
		}
		const uploadedFiles: File[] = [];
		for (const f of target.files) {
			if (!acceptFileTypes.includes(f.type)) {
				toast.error('File type is invalid');
				return;
			}
			if (f.size > fileSizeLimit) {
				toast.error('File is too large');
				return;
			}
			uploadedFiles.push(f);
		}
		files = uploadedFiles;
	}
</script>

<div
	class={cn(
		'relative border border-surface-700 text-center select-none block transition',
		dragging && 'bg-surface-800 text-primary-700 group z-0',
		!disabled && 'hover:text-primary-700 hover:bg-surface-800',
		disabled && 'opacity-50 cursor-not-allowed'
	)}
	use:dropfiles={{
		onDragEnter() {
			dragging = true;
		},
		onDragOver() {
			dragging = true;
		},
		onDragLeave() {
			dragging = false;
		},
		onDrop: handleDropFiles,
		acceptFileTypes,
		fileSizeLimit
	}}
>
	<input
		{disabled}
		on:change={handleUploadFile}
		type="file"
		accept={acceptFileTypes.join(',')}
		class="inset-0 z-0 absolute opacity-0 ring-1 peer enabled:cursor-pointer"
	/>
	<div
		class={'w-full py-12 px-2 peer-focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 ring-primary-700 rounded'}
	>
		<div class="mx-auto w-8">
			<svg
				class="w-8 h-8"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				><g
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					><path
						d="M13 21H3.6a.6.6 0 0 1-.6-.6V3.6a.6.6 0 0 1 .6-.6h16.8a.6.6 0 0 1 .6.6V13"
					/><path
						d="m3 16l7-3l5.5 2.5M16 10a2 2 0 1 1 0-4a2 2 0 0 1 0 4m0 9h3m3 0h-3m0 0v-3m0 3v3"
					/></g
				></svg
			>
		</div>
		<p class="mt-5 mb-1 font-medium text-lg text-surface-100">
			Click to upload or drop an image here
		</p>
		<p class="text-surface-300">JPG, PNG, or GIF. Up to {fileSizeMB}MB.</p>
	</div>
</div>
