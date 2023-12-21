<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import Select from '$lib/components/Select.svelte';
	import CheckmarkIcon from '$lib/components/icons/Checkmark.svelte';
	import PictureIcon from '$lib/components/icons/Picture.svelte';
	import FileUploadTrigger from '$lib/components/FileUploadTrigger.svelte';
	import PictureButton from '$lib/components/PictureButton.svelte';
	import XButton from '$lib/components/XButton.svelte';
	import ClickToUploadButton from '$lib/components/ClickToUploadButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { focus } from '$lib/utils';
	import toast from 'svelte-french-toast';
	import SaveAsDraftButton from '$lib/components/SaveAsDraftButton.svelte';

	export let data;
	$: ({ user } = data);

	let loading = false;

	let answers: {
		id: string;
		label?: string;
		image?: string;
		error?: string;
		focus?: boolean;
	}[] = [
		{
			id: Math.random().toString(16).slice(2),
			label: ''
		}
	];

	const pollTypes = [
		{
			label: 'Multiple Choice',
			value: 'text',
			icon: CheckmarkIcon
		},
		{
			label: 'Image',
			value: 'image',
			icon: PictureIcon
		}
	] as const;
	let pollType: (typeof pollTypes)[number]['value'];

	$: {
		if (pollType) {
			answers = [
				{
					id: Math.random().toString(16).slice(2),
					label: ''
				}
			];
		}
	}

	let pollImage: string | undefined = undefined;

	// use submit event
	async function handleSubmit(e: Event & { currentTarget: EventTarget & HTMLFormElement }) {
		e.preventDefault();
		const formdata = new FormData(e.currentTarget);
		console.log('event.currentTarget.action', e.currentTarget.action);

		// validation
		if (pollType === 'image') {
			let newAnswers = answers;
			let hasFocused = false;
			for (let i = 0; i < newAnswers.length; i++) {
				const element = newAnswers[i];
				if (!element.image) {
					element.error = 'Image is required.';
					if (!hasFocused) {
						element.focus = true;
					}
					hasFocused = true;
				} else {
					element.error = undefined;
				}
			}
			answers = newAnswers;
			if (hasFocused) {
				return;
			}
		}

		// poll image
		if (pollImage) {
			formdata.append('image', pollImage);
		}
		// answers
		formdata.append('answers', JSON.stringify(answers));
		console.log('formdata', formdata);

		const form = e.currentTarget;
		try {
			loading = true;
			const response = await fetch(form.action, {
				method: 'POST',
				body: formdata
			});
			const result = deserialize(await response.text());
			if (result.type === 'success') {
				answers = [];
				pollImage = undefined;
				form.reset();
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

<h2 class="text-2xl font-bold text-surface-50 max-w-3xl mx-auto">Create a poll</h2>
<p class="text-surface-300 mt-1 mb-5 max-w-3xl mx-auto">Fill up the fields below</p>
<form
	on:submit={handleSubmit}
	method="POST"
	action=""
	class="border border-surface-700 bg-surface-800 rounded flex flex-col px-8 py-6 max-w-3xl mx-auto"
>
	<label for="title" class="font-medium mb-1">Title</label>
	<div class="relative">
		<Input
			id="title"
			name="title"
			placeholder="Your question..."
			class="px-3 py-2 w-full"
			required
		/>
		<div class="absolute top-1 right-1">
			<FileUploadTrigger
				trigger={PictureButton}
				on:upload={(e) => {
					pollImage = e.detail;
				}}
			/>
		</div>
	</div>
	{#if pollImage}
		<div class="relative mt-4 mb-2">
			<XButton
				class="absolute top-0 right-0"
				aria-label="remove poll image"
				on:click={() => {
					pollImage = undefined;
				}}
			/>
			<img alt="poll" class="max-h-[300px] w-auto mx-auto" src={pollImage} />
		</div>
	{/if}
	<label for="description" class="font-medium mt-5 mb-1"
		>Description <span class="text-surface-400">(optional)</span></label
	>
	<textarea
		id="description"
		name="description"
		class="rounded-sm bg-surface-700 text-surface-100 px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 ring-offset-surface-900 placeholder:text-surface-400"
	/>
	<hr class="my-6 border-b border-surface-700" />
	<div class="mb-3 w-full md:w-[50%]">
		<label for="type" class="font-medium mb-1">Poll type</label>
		<Select id="type" name="type" className="w-full" bind:value={pollType} items={[...pollTypes]} />
	</div>
	<label for="maxChoice" class="font-medium mb-1">Maximum Choices</label>
	<Input
		type="number"
		min={1}
		max={answers.length}
		id="maxChoice"
		name="maxChoice"
		placeholder="1"
		class="px-3 py-2"
		required
	/>
	<p class="font-medium mb-1 mt-3">Answers</p>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
		{#each answers as answer, idx (answer.id)}
			<div class="relative">
				{#if pollType === 'text'}
					<input
						name={`answers.${idx}`}
						bind:value={answers[idx].label}
						placeholder={`Option ${idx + 1}`}
						class="rounded-sm bg-surface-700 text-surface-100 px-3 py-2 outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 ring-offset-surface-900 placeholder:text-surface-400 w-full"
						required
					/>
					{#if answers.length > 1}
						<XButton
							class="absolute top-1 right-1"
							aria-label="remove answer"
							on:click={() => {
								answers = answers.filter((a) => a.id !== answer.id);
							}}
						/>
					{/if}
				{:else if pollType === 'image'}
					<div class="border border-surface-700 p-2 rounded relative flex flex-col gap-2">
						{#if answers.length > 1}
							<XButton
								class="absolute top-2 right-2"
								aria-label="remove answer"
								on:click={() => {
									answers = answers.filter((a) => a.id !== answer.id);
								}}
							/>
						{/if}
						<ClickToUploadButton
							bind:image={answer.image}
							error={answer.error}
							bind:focus={answer.focus}
						/>
						<input
							use:focus={idx === answers.length - 1}
							bind:value={answers[idx].label}
							name={`answers.text.${idx}`}
							placeholder={`Label ${idx + 1}  (optional)`}
							class="rounded-sm bg-surface-700 text-surface-100 px-3 py-2 outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 ring-offset-surface-900 placeholder:text-surface-400 w-full"
						/>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<button
		type="button"
		class="max-w-max px-3 py-2 rounded-sm font-medium text-surface-50 bg-surface-700 outline-none transition focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 focus-visible:ring-primary-700 enabled:hover:text-white enabled:hover:bg-surface-600"
		on:click={() => {
			answers.push({ label: '', id: Math.random().toString(16).slice(2) });
			answers = answers;
		}}
	>
		Add Answer
	</button>
	<hr class="my-6 border-transparent" />
	<div class="flex flex-row gap-5">
		<button
			disabled={loading}
			type="submit"
			class="w-[150px] py-2 rounded-sm font-medium text-surface-50 bg-primary-700 outline-none transition focus-visible:ring-1 disabled:opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 focus-visible:ring-primary-700 enabled:hover:text-white enabled:hover:bg-primary-600"
		>
			{#if loading}
				Creating...
			{:else}
				Create poll
			{/if}
		</button>
		<SaveAsDraftButton {loading} {user} />
	</div>
</form>
