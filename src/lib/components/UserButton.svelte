<script lang="ts">
	import type { User } from 'lucia';
	import { clickOutside } from '$lib/clickoutside';
	import createPopperAction from '$lib/popover';
	import CreatePollLink from './CreatePollLink.svelte';
	import SignoutLink from './SignoutLink.svelte';

	const [usePopperTrigger, usePopperContent] = createPopperAction();

	export let user: User;
	let open = false;
</script>

<svelte:body
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			open = false;
		}
	}}
/>
<button
	on:click={() => {
		open = true;
	}}
	use:usePopperTrigger
	aria-label="user menu"
	class="hidden lg:grid place-items-center rounded-full border border-surface-700 w-9 h-9 transition enabled:hover:text-primary-100 enabled:hover:bg-surface-800 outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 focus-visible:ring-primary-700"
>
	<svg
		class="w-6 h-6"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<path
			fill="currentColor"
			d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m0 7c2.67 0 8 1.33 8 4v3H4v-3c0-2.67 5.33-4 8-4m0 1.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1"
		/>
	</svg>
</button>
{#if open}
	<div
		use:clickOutside={() => {
			open = false;
		}}
		use:usePopperContent={{
			placement: 'bottom-end',
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [-2, 5]
					}
				}
			]
		}}
		role="menu"
		class="[&>*]:px-4 py-3 max-w-sm min-w-[300px] rounded-sm shadow bg-surface-950 border border-surface-700"
	>
		<div>
			<h2
				aria-label="User name"
				class="font-medium text-surface-100 truncate text-ellipsis w-full max-w-full text-lg"
			>
				{user.username}
			</h2>
			<p class="text-sm text-surface-300">pollpy user</p>
		</div>
		<hr class="border-transparent border-b border-b-surface-700 my-3 mx-1" />
		<CreatePollLink />
		<hr class="border-transparent border-b border-b-surface-700 my-3 mx-1" />
		<SignoutLink />
	</div>
{/if}
