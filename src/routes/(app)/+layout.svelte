<script>
	export let data;
</script>

<main class="min-h-[100dvh] text-surface-200">
	<nav>
		<div class="max-w-5xl mx-auto py-2 px-5 flex flex-row gap-3 items-center">
			{#if data.user}
				<div class="ml-auto">{data.user.username}</div>
				<form method="POST">
					<button
						formaction="?/logout"
						type="submit"
						class="px-3 py-1 border rounded-sm border-surface-500 text-surface-100 outline-none transition focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 focus-visible:ring-primary-500 enabled:hover:bg-surface-800 enabled:hover:text-white"
					>
						Sign out
					</button>
				</form>
			{/if}
		</div>
	</nav>
	<div class="max-w-5xl mx-auto">
		<slot />
	</div>
</main>
