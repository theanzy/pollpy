<script>
	import SharePollModal from '$lib/components/SharePollModal.svelte';
	import '../global.css';
	import { Toaster } from 'svelte-french-toast';
</script>

<svelte:head>
	<title>pollpy</title>
	<meta name="description" content="straw polls" />
	<meta name="robots" content="noindex nofollow" />
</svelte:head>
<Toaster
	position={'bottom-right'}
	toastOptions={{
		style: 'border-radius: 5px; background: #333; color: #fff;',
		duration: 2000
	}}
/>
<SharePollModal />
<div id="mainLayout" class="min-h-screen bg-surface-900 text-surface-200">
	<slot />
</div>
