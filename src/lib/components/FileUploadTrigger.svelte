<script lang="ts">
	import type { ComponentType } from 'svelte';
	import FileUploadModal from './FileUploadModal.svelte';

	export let trigger: ComponentType;
	let open = false;
</script>

<svelte:component
	this={trigger}
	on:click={() => {
		open = true;
	}}
/>
<FileUploadModal bind:open on:upload />
