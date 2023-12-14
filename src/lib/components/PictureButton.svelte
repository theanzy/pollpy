<script lang="ts">
	import PictureIcon from '$lib/components/icons/Picture.svelte';
</script>

<button
	on:click
	type="button"
	class="rounded-full grid place-items-center outline-none transition w-8 h-8 ocus-visible:bg-surface-950 focus-visible:ring-1 ring-primary-700 hover:bg-surface-800 hover:text-primary-50"
>
	<PictureIcon class="w-6 h-6" />
</button>
