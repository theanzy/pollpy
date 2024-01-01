<script lang="ts">
	import { page } from '$app/stores';
	import PollForm from '$lib/components/PollForm.svelte';

	export let data;
	$: slug = $page.params.slug;
	$: ({ poll, error } = data);
</script>

<div class="max-w-3xl mx-auto">
	<h2 class="text-2xl font-bold text-surface-50 mx-auto">Edit Poll</h2>
	<p class="text-surface-300 mt-1 mb-5 mx-auto">Change the details of your poll</p>
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
	{:else}
		<PollForm initialData={poll}>
			<svelte:fragment slot="actions">
				<button
					class="font-medium px-4 py-2 w-full md:w-[150px] bg-primary-600 hover:bg-primary-700 hover:text-white text-surface-50 transition outline-none focus-visible:ring-1 ring-primary-600 ring-offset-2 ring-offset-surface-950 rounded-sm"
					formaction="?/edit"
				>
					Save
				</button>
			</svelte:fragment>
		</PollForm>
	{/if}
</div>
