<script lang="ts">
	import createPopperAction from '$lib/popover';
	import { fade } from 'svelte/transition';
	import SharePollButton from './SharePollButton.svelte';
	import DeletePollButton from './DeletePollButton.svelte';

	export let slug: string;

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
		<button type="button" class="flex flex-row gap-2 items-center hover:text-white">
			<svg
				class="w-5 h-5"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
				/></svg
			>
			Edit
		</button>
		<hr class="border-b border-transparent border-b-surface-600" />
		<button type="button" class="flex flex-row gap-2 items-center hover:text-white">
			<svg
				class="w-5 h-5"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12q0-1.45-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12q0 1.45 1.013 2.475T12.05 15.5"
				/></svg
			>
			Poll Settings
		</button>
		<SharePollButton
			class="bg-transparent justify-start text-base border-none text-surface-200"
			{slug}
		/>
		<hr class="border-b border-transparent border-b-surface-600" />
		<DeletePollButton {slug} />
	</div>
{/if}
