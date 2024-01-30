<script lang="ts">
	import createPopperAction from '$lib/popover';
	import { fade } from 'svelte/transition';
	import SharePollButton from './SharePollButton.svelte';
	import DeletePollButton from './DeletePollButton.svelte';
	import type { PollWithAnswers } from '$lib/server/schema/poll';
	import { page } from '$app/stores';

	export let slug: string;
	export let poll: PollWithAnswers;

	let menuOpen = false;
	const [usePopperTrigger, usePopperContent] = createPopperAction();
</script>

<svelte:body
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			menuOpen = false;
		}
	}}
/>
<button
	use:usePopperTrigger={{
		onClick() {
			menuOpen = !menuOpen;
		}
	}}
	class="outline-none rounded-full p-1 transition hover:text-primary-200 focus-visible:ring-1 ring-primary-500"
	type="button"
	aria-label="more options"
>
	<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m14 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-7 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"
		/></svg
	>
</button>
{#if menuOpen}
	<div
		transition:fade={{ duration: 200 }}
		use:usePopperContent={{
			onClickOutside() {
				menuOpen = false;
			},
			params: {
				placement: 'bottom-end'
			}
		}}
		class="[&>:is(a,button)]:px-4 [&>:is(a,button)]:w-full [&>:is(a,button)]:outline-none focus-visible:[&>:is(a,button)]:ring-1 [&>:is(a,button)]:ring-offset-2 [&>:is(a,button)]:ring-offset-surface-950 [&>:is(a,button)]:rounded [&>:is(a,button)]:ring-primary-600 [&>:is(a,button)]:transition hover:[&>:is(a,button)]:bg-surface-800 [&>:is(a,button)]:py-2 py-1.5 max-w-sm min-w-[250px] rounded shadow bg-surface-950 border border-surface-600 z-10"
	>
		<a href="{$page.params.slug}/edit" class="flex flex-row gap-2 items-center hover:text-white">
			<svg
				class="w-5 h-5"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
				/>
			</svg>
			Edit
		</a>
		<hr class="border-b border-transparent border-b-surface-600" />

		{#if poll.status === 'active'}
			{#if poll.flags?.allowShareButton}
				<SharePollButton
					on:click={() => {
						menuOpen = false;
					}}
					class="bg-transparent justify-start text-base border-none text-surface-200"
					{slug}
				/>
			{/if}
		{/if}
		<hr class="border-b border-transparent border-b-surface-600" />
		<DeletePollButton
			on:click={() => {
				menuOpen = false;
			}}
			{slug}
		/>
	</div>
{/if}
