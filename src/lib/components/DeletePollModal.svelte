<script lang="ts">
	import { deletePollModalStore } from '$lib/modalStore';
	import { clickOutside } from '$lib/clickoutside';
	import Modal from './Modal.svelte';
	import { deserialize } from '$app/forms';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	$: slug = $deletePollModalStore.params?.slug;
	let loading = false;

	async function handleSubmit(e: Event & { currentTarget: EventTarget & HTMLFormElement }) {
		e.preventDefault();

		const form = e.currentTarget;
		try {
			loading = true;
			const response = await fetch(form.action, {
				method: 'POST',
				body: new FormData()
			});
			const result = deserialize(await response.text());
			if (result.type === 'failure') {
				console.log('failure');
				if (!!result.data && 'error' in result.data) {
					throw new Error(result.data.error as string);
				}
			}
			if (result.type === 'success') {
				form.reset();
				toast.success('Poll deleted.');
			}
			goto('/');
		} catch (error) {
			console.log('vote error', error);
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Fail to vote');
			}
		} finally {
			loading = false;
		}
	}
</script>

<Modal bind:open={$deletePollModalStore.open} closeButton>
	<div
		use:clickOutside={() => {
			$deletePollModalStore.open = false;
		}}
	>
		<h2 class="pt-4 px-5 font-medium flex flex-row gap-2 items-center text-lg">
			<svg
				class="w-5 h-5"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<g fill="none"
					><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" /><path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-width="1.5"
						d="M12 7v6"
					/><circle cx="12" cy="16" r="1" fill="currentColor" /></g
				>
			</svg>
			Delete Poll
		</h2>
		<hr class="border-b border-transparent border-b-surface-700 my-3" />
		<div class="px-5 mt-2 text-surface-300">
			<p>
				Are you sure you want to delete this poll? All asociated data including votes, will be
				removed. This action cannot be undone.
			</p>
		</div>
		<hr class="border-b border-transparent my-2" />
		<form
			method="POST"
			action="/{slug}/?/delete"
			class="px-5 py-5 flex flex-row gap-5"
			on:submit={handleSubmit}
		>
			<button
				class="ml-auto w-[150px] py-1 bg-surface-50 text-surface-950 font-medium outline-none hover:bg-primary-50 focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 ring-primary-600 rounded-sm"
				type="button"
				on:click={() => {
					$deletePollModalStore.open = false;
				}}>Cancel</button
			>
			<button
				disabled={loading}
				type="submit"
				class="w-[150px] py-1 bg-rose-700 text-surface-50 font-medium outline-none enabled:hover:bg-rose-800 enabled:hover:text-white focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 ring-rose-800 rounded-sm"
			>
				{#if loading}
					Deleting...
				{:else}
					Delete
				{/if}
			</button>
		</form>
	</div>
</Modal>
