<script lang="ts">
	import PictureIcon from '$lib/components/icons/Picture.svelte';
	import FileUploadModal from './FileUploadModal.svelte';
	export let file: File | undefined = undefined;
	let open = false;
</script>

<FileUploadModal
	bind:open
	on:upload={(e) => {
		file = e.detail;
	}}
/>

<button
	type="button"
	class="w-full h-[200px] outline-none border-none bg-surface-700 hover:bg-surface-600 rounded transition focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 ring-primary-700 p-1"
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
		</div>
	{/if}
</button>
