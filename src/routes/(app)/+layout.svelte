<script>
	import CreatePollLink from '$lib/components/CreatePollLink.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import UserButton from '$lib/components/UserButton.svelte';
	import SharePollModal from '$lib/components/SharePollModal.svelte';
	import DeletePollModal from '$lib/components/DeletePollModal.svelte';
	export let data;
</script>

<SharePollModal />
<DeletePollModal />
<main class="min-h-[100dvh] text-surface-200">
	<nav>
		<div class="max-w-5xl mx-auto py-5 px-5 flex flex-row gap-3 items-center">
			<a href="/" class="font-bold text-xl text-white mr-auto">pollpy</a>
			<CreatePollLink class="text-md md:text-lg" />
			<div class="ml-auto flex flex-row gap-3 items-center">
				<Menu user={data.user} />
				{#if data.user}
					<UserButton user={data.user} />
				{:else}
					<a
						href="/signup"
						class="hidden lg:block px-4 py-2 font-medium outline-none transition hover:text-primary-500 text-primary-600 focus-visible:text-primary-500"
					>
						Sign up
					</a>
					<a
						href="/login"
						class="hidden lg:block px-4 py-2 rounded font-medium outline-none transition hover:text-white focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 focus-visible:ring-primary-700"
					>
						Log in
					</a>
				{/if}
			</div>
		</div>
	</nav>
	<div class="max-w-5xl mx-auto px-5 py-3">
		<slot />
	</div>
</main>
