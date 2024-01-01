<script lang="ts">
	import { page } from '$app/stores';

	export let data;
	$: slug = $page.params.slug;
	$: ({ poll, error } = data);
</script>

<h2 class="font-medium text-surface-100 mb-2">Edit Poll</h2>
{#if error && !poll}
	<div class="mt-3">
		<p class="text-center">{error}</p>
		<a
			href="/{slug}"
			class="mx-auto block max-w-max mt-5 bg-primary-600 text-surface-50 px-4 py-2 rounded outline-none transition hover:text-white hover:bg-primary-700"
		>
			Go back to poll
		</a>
	</div>
{/if}
