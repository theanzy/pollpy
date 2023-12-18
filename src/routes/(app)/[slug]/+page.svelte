<script>
	import { dateMoment } from '$lib/utils';

	// your script goes here
	export let data;
	$: poll = data.poll;
</script>

{#if poll}
	<form
		method="post"
		class="border border-surface-700 bg-surface-800 rounded flex flex-col px-8 py-6 max-w-3xl mx-auto"
	>
		<h2 class="text-xl font-semibold text-surface-50">{poll.title}</h2>
		<p>
			by {poll.creatorName} <span class="mx-1">·</span>
			{dateMoment(poll.createdAt, new Date())}
		</p>
		<hr class="my-2 border border-transparent" />
		<p class="mb-2">Make a choice:</p>
		{#if poll.type === 'text'}
			<fieldset class="flex flex-col gap-2">
				{#each poll.answers as answer (answer.id)}
					<div class="flex flex-row gap-2 items-center">
						<input
							class="relative float-left h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary-500 checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary-500 checked:after:bg-primary-500 checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary-500 checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary-500 dark:checked:after:border-primary-500 dark:checked:after:bg-primary-500 dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary-500 dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
							id={answer.id}
							name="answer"
							type="radio"
							value={answer.id}
						/>
						<label class="cursor-pointer" for={answer.id}>{answer.label}</label>
					</div>
				{/each}
			</fieldset>
		{/if}
		<hr class="my-3 border border-transparent" />
		<div class="flex flex-row">
			<button
				class="w-max flex flex-row gap-1 items-center rounded-sm bg-primary-700 text-surface-50 px-6 py-1 transition enabled:hover:text-white enabled:hover:bg-primary-600"
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
						fill-rule="evenodd"
						d="m9.94 12.646l-2.248-.749c-2.353-.784-3.53-1.176-3.53-1.897c0-.72 1.177-1.113 3.53-1.897l8.513-2.838c1.656-.552 2.484-.828 2.921-.391c.437.437.161 1.265-.39 2.92l-2.839 8.514c-.784 2.353-1.176 3.53-1.897 3.53c-.72 0-1.113-1.177-1.897-3.53l-.75-2.247l4.354-4.354a1 1 0 0 0-1.414-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
				Vote
			</button>
		</div>
	</form>
	<hr class="my-2 border border-transparent" />
	<div class="flex flex-row gap-1 items-center justify-center text-surface-300">
		<svg
			class="w-4 h-4"
			xmlns="http://www.w3.org/2000/svg"
			width="100"
			height="100"
			viewBox="0 0 100 100"
		>
			<path
				fill="currentColor"
				d="M82.105 44.218h-8.858v-8.431c.003-.036.003-.071.003-.102c0-13.073-10.636-23.71-23.713-23.71c-13.073 0-23.71 10.637-23.71 23.71v8.533h-7.931a2.62 2.62 0 0 0-2.621 2.621v38.565a2.62 2.62 0 0 0 2.621 2.621h64.21a2.62 2.62 0 0 0 2.621-2.621V46.839a2.621 2.621 0 0 0-2.622-2.621m-42.314-8.533c0-5.375 4.371-9.741 9.746-9.741c5.341 0 9.695 4.32 9.747 9.649l-.003.031h.003v8.594H39.791z"
			/>
		</svg>
		{#if poll.identifyVoteBy === 'cookie session'}
			One vote per browser session allowed.
		{/if}
	</div>
{:else}
	<div class="mt-10 text-center">
		<h2 class="font-semibold text-2xl text-surface-50 mb-2">Page not found</h2>
		<p class="mb-8">This page does not exist</p>
		<a
			href="/"
			class="bg-primary-600 text-surface-50 px-4 py-2 rounded outline-none transition hover:text-white hover:bg-primary-700"
		>
			Go back
		</a>
	</div>
{/if}
