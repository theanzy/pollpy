<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import SaveAsDraftButton from '$lib/components/SaveAsDraftButton.svelte';
	import PollForm, { type PollFormEvent } from '$lib/components/PollForm.svelte';

	export let data;
	$: ({ user } = data);

	let loading = false;
	let formaction = '';

	// use submit event
	async function handleSubmit(e: { detail: PollFormEvent['submit'] }) {
		formaction = e.detail.formaction;
		try {
			loading = true;
			const response = await fetch(e.detail.formaction, {
				method: 'POST',
				body: e.detail.data
			});
			const result = deserialize(await response.text());
			if (result.type === 'success') {
				e.detail.resetForm?.();
				// rerun all `load` functions, following the successful update
				toast.success('Poll created');
				await invalidateAll();
				if (result.data?.slug) {
					console.log('pollid', result.data.slug);
					goto(`/${result.data.slug as string}`);
				}
			} else if (result.type === 'failure') {
				if (result?.data?.error) {
					toast.error(result.data?.error as string);
				}
			}
			applyAction(result);
		} catch (error) {
			console.log('error create poll', error);
			toast.error('Something went wrong');
		} finally {
			loading = false;
		}
	}
</script>

<div class="max-w-3xl mx-auto">
	<h2 class="text-2xl font-bold text-surface-50 mx-auto">Create a poll</h2>
	<p class="text-surface-300 mt-1 mb-5 mx-auto">Fill up the fields below</p>
	<PollForm on:submit={handleSubmit}>
		<svelte:fragment slot="actions">
			<button
				disabled={loading}
				formaction="?/add"
				type="submit"
				class="w-full md:w-[150px] py-2 rounded-sm font-medium text-surface-50 bg-primary-700 outline-none transition focus-visible:ring-1 disabled:opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 focus-visible:ring-primary-700 enabled:hover:text-white enabled:hover:bg-primary-600"
			>
				{#if loading && formaction === '/create?/add'}
					Creating...
				{:else}
					Create poll
				{/if}
			</button>
			<SaveAsDraftButton
				class="w-full md:w-[150px]"
				disabled={loading}
				loading={loading && formaction === '/create?/draft'}
				{user}
			/>
		</svelte:fragment>
	</PollForm>
</div>
