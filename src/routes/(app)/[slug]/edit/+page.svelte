<script lang="ts">
	import { deserialize } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import PollForm, { type PollFormEvent } from '$lib/components/PollForm.svelte';
	import { differenceInSeconds } from 'date-fns';
	import toast from 'svelte-french-toast';

	export let data;
	$: slug = $page.params.slug;
	$: ({ poll, error } = data);
	let loading = false;
	async function handleSubmit(e: { detail: PollFormEvent['submit'] }) {
		try {
			loading = true;
			const response = await fetch(e.detail.formaction, {
				method: 'POST',
				body: e.detail.data
			});
			const result = deserialize(await response.text());
			if (result.type === 'success') {
				// rerun all `load` functions, following the successful update
				toast.success('Poll saved');
				await invalidate('poll');
			} else if (result.type === 'failure') {
				if (result?.data?.error) {
					toast.error(result.data?.error as string);
				}
			}
		} catch (error) {
			console.log('error create poll', error);
			toast.error('Something went wrong');
		} finally {
			loading = false;
		}
	}
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
		<PollForm initialData={poll} on:submit={handleSubmit}>
			<svelte:fragment slot="actions">
				{#if poll?.closedAt && differenceInSeconds(poll.closedAt, new Date()) < 0}
					<p class="text-amber-600 text-sm text-center w-full">This poll is already closed</p>
				{:else}
					<button
						disabled={loading}
						class="disabled:opacity-50 font-medium px-4 py-2 w-full md:w-[150px] bg-primary-600 enabled:hover:bg-primary-700 enabled:hover:text-white text-surface-50 transition outline-none focus-visible:ring-1 ring-primary-600 ring-offset-2 ring-offset-surface-950 rounded-sm"
						formaction="?/edit"
					>
						{#if loading}
							Saving...
						{:else}
							Save
						{/if}
					</button>
				{/if}
			</svelte:fragment>
		</PollForm>
	{/if}
</div>
