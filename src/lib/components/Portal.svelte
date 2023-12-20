<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	let ref: HTMLDivElement;
	let portal: HTMLDivElement;
	export let target: string;
	onMount(() => {
		portal = document.createElement('div');
		portal.className = 'portal';
		document.querySelector(target)?.appendChild(portal);
		portal.appendChild(ref);
	});

	onDestroy(() => {
		document.querySelector(target)?.removeChild(portal);
	});
</script>

<div class="portal-clone">
	<div bind:this={ref}>
		<slot />
	</div>
</div>

<style>
	.portal-clone {
		display: none;
	}
</style>
