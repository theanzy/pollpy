<script>
	import '../global.css';
	import { Toaster } from 'svelte-french-toast';
</script>

<svelte:head>
	<title>polly</title>
	<meta name="description" content="straw pools" />
	<meta name="robots" content="noindex nofollow" />
</svelte:head>
<Toaster
	position={'bottom-right'}
	toastOptions={{
		style: 'border-radius: 5px; background: #333; color: #fff;',
		duration: 2000
	}}
/>

<div class="min-h-screen bg-surface-950 text-surface-200">
	<slot />
</div>
