<script lang="ts">
	import PictureIcon from '$lib/components/icons/Picture.svelte';
	import { onMount } from 'svelte';
	import FileUploadModal from './FileUploadModal.svelte';

	let open = false;
	let mounted = false;
	let button: HTMLButtonElement;
	export let file: File | undefined = undefined;
	export let error: string | undefined = undefined;
	export let focus: boolean | undefined = undefined;

	onMount(() => {
		mounted = true;
	});

	$: if (mounted && focus && error) {
		button.focus();
		focus = false;
	}
</script>

<FileUploadModal
	bind:open
	on:upload={(e) => {
		file = e.detail;
	}}
/>

<button
	bind:this={button}
	type="button"
	class="w-full h-[200px] outline-none border-none bg-surface-700 enabled:hover:bg-surface-600 rounded transition ring-offset-2 ring-offset-surface-950 p-1 {error
		? 'ring-1 ring-rose-700'
		: 'ring-primary-700 enabled:focus-visible:ring-1'}"
	on:click={() => {
		open = true;
	}}
>
	{#if file}
		<img class="max-h-full w-auto mx-auto" alt="answer" src={URL.createObjectURL(file)} />
	{:else}
		<div class="w-full h-full flex flex-col justify-center items-center gap-1 py-10 px-10">
			<PictureIcon class="w-8 h-8" />
			<p class="text-surface-300 text-sm">Click to upload image</p>
			{#if error}
				<p class="text-sm text-red-700">{error}</p>
			{/if}
		</div>
	{/if}
</button>
