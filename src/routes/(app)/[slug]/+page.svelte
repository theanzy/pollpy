<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { dateMoment } from '$lib/utils';
	import toast from 'svelte-french-toast';

	// your script goes here
	export let data;
	export let loading = false;
	$: ({ poll } = data);

	async function handleSubmit(e: Event & { currentTarget: EventTarget & HTMLFormElement }) {
		e.preventDefault();
		if (!poll?.id) {
			return;
		}
		const formdata = new FormData(e.currentTarget);
		const answers: string[] = [];
		for (const v of formdata.values()) {
			if (typeof v === 'string') {
				answers.push(v);
			}
		}

		// validation
		if (answers.length < 1) {
			toast.error('Must have at least one vote');
			return;
		} else if (answers.length > poll.maxChoice) {
			toast.error(`Vote choices must not be more than ${poll.maxChoice}`);
			return;
		}

		const formToSubmit = new FormData();
		formToSubmit.append('answers', JSON.stringify(answers));
		formToSubmit.append('pollId', poll.id);

		const form = e.currentTarget;
		try {
			loading = true;
			const response = await fetch(form.action, {
				method: 'POST',
				body: formToSubmit
			});
			const result = deserialize(await response.text());
			if (result.type === 'failure') {
				if (!!result.data && 'error' in result.data) {
					throw new Error(result.data.error as string);
				}
			}
			if (result.type === 'success') {
				form.reset();
				toast.success('Your votes are added.');
			}
			await applyAction(result);
			console.log('response', result);
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

{#if poll}
	<form
		on:submit={handleSubmit}
		method="post"
		action="?/vote"
		class="border border-surface-700 bg-surface-800 rounded flex flex-col px-8 py-6 max-w-3xl mx-auto"
	>
		<h2 class="text-xl font-semibold text-surface-50">{poll.title}</h2>
		<p>
			by {poll.creatorName} <span class="mx-1">·</span>
			{dateMoment(poll.createdAt, new Date())}
		</p>
		<hr class="my-2 border border-transparent" />
		<p class="mb-2 text-sm">You can choose at most {poll.maxChoice} answers:</p>
		{#if poll.type === 'text'}
			<fieldset class="flex flex-col gap-2">
				{#each poll.answers as answer (answer.id)}
					<div class="flex flex-row gap-2 items-center">
						<input
							class="relative float-left h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary-500 checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary-500 checked:after:bg-primary-500 checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary-500 checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary-500 dark:checked:after:border-primary-500 dark:checked:after:bg-primary-500 dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary-500 dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
							id={answer.id}
							name={poll.maxChoice > 1 ? `answer.${answer.id}` : 'answer'}
							type={poll.maxChoice > 1 ? 'checkbox' : 'radio'}
							value={answer.id}
						/>
						<label class="cursor-pointer" for={answer.id}>{answer.label}</label>
					</div>
				{/each}
			</fieldset>
		{:else if poll.type === 'image'}
			<fieldset
				class="grid grid-cols-1 lg:grid-cols-2 bg-surface-700 overflow-hidden rounded gap-[1px] border border-surface-700"
			>
				{#each poll.answers as answer (answer.id)}
					<div class="flex items-center gap-1 px-4 py-2 group overflow-hidden bg-surface-800">
						<input
							class="relative float-left h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-5 before:w-5 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[''] after:absolute after:z-[1] after:block after:h-5 after:w-4 after:rounded-full after:content-[''] checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] checked:focus:before:scale-100 dark:border-neutral-600 checked:border-primary-500 checked:after:border-primary-500 checked:after:bg-primary-500 checked:focus:border-primary-500"
							id={answer.id}
							name={poll.maxChoice > 1 ? `answer.${answer.id}` : 'answer'}
							type={poll.maxChoice > 1 ? 'checkbox' : 'radio'}
							value={answer.id}
						/>
						<label
							for={answer.id}
							class="w-full cursor-pointer rounded flex flex-col gap-1 justify-center items-center transition ring-offset-2 ring-offset-surface-950 ring-primary-700 peer-checked:ring-2 peer-focus:scale-105"
						>
							<div class="h-[200px]">
								<img
									src={answer.image}
									alt={answer.label}
									class="max-h-full max-w-auto h-auto w-auto transition group-hover:scale-105"
								/>
							</div>
							{#if answer.label}
								<p class="self-start mt-1 pl-5 text-surface-300 font-medium">{answer.label}</p>
							{/if}
						</label>
					</div>
				{/each}
			</fieldset>
		{/if}
		<hr class="my-3 border border-transparent" />
		<div class="flex flex-row gap-6">
			<button
				disabled={loading}
				class="text-sm flex flex-row gap-1 items-center border-none justify-center rounded-sm bg-primary-700 text-surface-50 w-[150px] py-2 transition enabled:hover:text-white enabled:hover:bg-primary-600 outline-none focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 ring-primary-600"
			>
				{#if loading}
					<svg
						class="w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z"
						/></svg
					>
					Validating...
				{:else}
					<svg
						class="w-5 h-5"
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
				{/if}
			</button>
			<button
				type="button"
				on:click={() => {
					goto(`${$page.params.slug}/result`);
				}}
				class="text-sm flex flex-row gap-2 items-center justify-center w-[150px] py-2 rounded-sm border border-surface-600 bg-surface-900 font-medium transition enabled:hover:bg-surface-800 outline-none focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 ring-surface-400"
			>
				<svg
					class="w-5 h-5"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 16 16"
				>
					<path
						fill="currentColor"
						d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"
					/>
				</svg>
				See Results
			</button>
		</div>
	</form>
	<hr class="my-2 border border-transparent" />
	<div class="flex flex-row gap-1 items-center justify-center text-surface-300">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
			<path
				fill="currentColor"
				d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"
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
