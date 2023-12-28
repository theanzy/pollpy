<script lang="ts">
	import { deletePollModalStore } from '$lib/modalStore';
	import { createEventDispatcher } from 'svelte';
	export let slug: string;
	const dispatch = createEventDispatcher<{
		click: void;
	}>();
</script>

<button
	on:click={() => {
		dispatch('click');
		deletePollModalStore.openModal({
			slug: slug
		});
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
