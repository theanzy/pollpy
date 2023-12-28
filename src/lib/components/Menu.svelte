<script lang="ts">
	import { trapFocus } from '$lib/trapfocus';
	import type { User } from 'lucia';
	import CreatePollLink from './CreatePollLink.svelte';
	import SignoutLink from './SignoutLink.svelte';
	import LoginLink from './LoginLink.svelte';
	import SignupLink from './SignupLink.svelte';
	import { fadeFly } from '$lib/transitions';
	import { afterNavigate } from '$app/navigation';
	import PollsLink from './PollsLink.svelte';

	export let user: User | undefined;

	let open = false;
	afterNavigate(() => {
		open = false;
	});
</script>

<button
	class="lg:hidden grid place-items-center transition enabled:hover:text-primary-200"
	on:click={() => {
		open = true;
	}}
>
	<svg
		class="w-7 h-7"
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 16 16"
	>
		<path
			fill="currentColor"
			fill-rule="evenodd"
			d="M0 3.75A.75.75 0 0 1 .75 3h14.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 3.75M0 8a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 8m.75 3.5a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5z"
			clip-rule="evenodd"
		/>
	</svg>
</button>

<svelte:body
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			open = false;
		}
	}}
/>
{#if open}
	<div use:trapFocus class="bg-black/20 fixed inset-0 w-full h-full grid place-items-center z-10">
		<div
			class="bg-surface-950 w-full h-[100dvh] flex flex-col rounded relative"
			transition:fadeFly={{
				x: 200,
				duration: 200
			}}
		>
			<button
				class="absolute top-4 right-4"
				aria-label="close modal"
				on:click={() => {
					open = false;
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
					/>
				</svg>
			</button>
			<div class="mt-7 overflow-y-auto flex-1">
				<div class="flex flex-col gap-2">
					{#if user}
						<div class="px-3">
							<p
								class="font-medium text-lg text-surface-50 max-w-[70dvw] md:max-w-none truncate text-ellipsis"
							>
								{user.username}
							</p>
							<p class="text-sm text-surface-300">pollpy user</p>
						</div>
					{/if}
					<hr class="border border-transparent my-1" />
					<CreatePollLink />
					<PollsLink />
					<hr class="border border-transparent" />
					{#if !user}
						<div class="flex flex-col gap-3">
							<SignupLink />
							<LoginLink />
						</div>
					{:else}
						<SignoutLink />
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
