<script>
	import Menu from '$lib/components/Menu.svelte';

	export let data;
</script>

<main class="min-h-[100dvh] text-surface-200">
	<nav>
		<div class="max-w-5xl mx-auto py-5 px-5 flex flex-row gap-3 items-center">
			<a href="/" class="font-bold text-xl text-white">poolpy</a>
			<div class="ml-auto">
				<Menu user={data.user} />
			</div>
		</div>
	</nav>
	<div class="max-w-5xl mx-auto">
		<slot />
	</div>
</main>
