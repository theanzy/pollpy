<script lang="ts" context="module">
	export type PollFormEvent = {
		submit: {
			data: FormData;
			formaction: string;
			resetForm?: () => void;
		};
	};
</script>

<script lang="ts">
	import CheckmarkIcon from '$lib/components/icons/Checkmark.svelte';
	import PictureIcon from '$lib/components/icons/Picture.svelte';
	import { createEventDispatcher } from 'svelte';
	import ClickToUploadButton from './ClickToUploadButton.svelte';
	import FileUploadTrigger from './FileUploadTrigger.svelte';
	import Input from './Input.svelte';
	import PictureButton from './PictureButton.svelte';
	import Select from './Select.svelte';
	import XButton from './XButton.svelte';
	import { page } from '$app/stores';
	import type { PollWithAnswers, ResultVisibility } from '$lib/server/schema/poll';
	import ToggleBlock from './ToggleBlock.svelte';
	import Checkbox from './Checkbox.svelte';
	import DateTimePicker from './DateTimePicker.svelte';

	export let initialData: PollWithAnswers | null = null;

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
	$: if (initialData) {
		answers = (initialData.answers as any) ?? [];
	}

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
	let pollType: (typeof pollTypes)[number]['value'] = initialData?.type as any;

	let pollImage: string | undefined = undefined;
	$: if (initialData) {
		pollImage = initialData.image || undefined;
	}

	const resultVisibilityOptions: { label: string; value: ResultVisibility }[] = [
		{
			label: 'Always public',
			value: 'public'
		},
		{
			label: 'Public after vote',
			value: 'after vote'
		},
		{
			label: 'Public after poll end',
			value: 'after poll end'
		},
		{
			label: 'Only visible to creator',
			value: 'creator'
		}
	];

	const dispatch = createEventDispatcher<PollFormEvent>();

	async function handleSubmit(e: Event & { currentTarget: EventTarget & HTMLFormElement }) {
		e.preventDefault();
		console.log('submit');
		const { submitter } = e as unknown as { submitter: HTMLButtonElement };
		e.currentTarget.action = submitter.formAction;
		let formaction = e.currentTarget.action.replace($page.url.origin, '');
		const formdata = new FormData(e.currentTarget);

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
		const form = e.currentTarget;
		dispatch('submit', {
			data: formdata,
			formaction,
			resetForm: () => {
				form.reset();
				answers = [];
				pollImage = undefined;
			}
		});
	}
	$: console.log('initialdata', initialData);
</script>

<form
	on:submit={handleSubmit}
	method="POST"
	class="border border-surface-700 bg-surface-800 rounded flex flex-col px-3 md:px-8 py-4 md:py-6"
>
	<label for="title" class="font-medium mb-1">Title</label>
	<div class="relative">
		<Input
			value={initialData?.title || undefined}
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
	<label for="description" class="font-medium mt-5 mb-1">
		Description <span class="text-surface-400">(optional)</span>
	</label>
	<textarea
		value={initialData?.description ?? ''}
		id="description"
		name="description"
		class="rounded-sm bg-surface-700 text-surface-100 px-3 py-2 outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 ring-offset-surface-900 placeholder:text-surface-400"
	/>
	<hr class="my-6 border-b border-surface-700" />
	<div class="mb-3 w-full md:w-[50%]">
		<label for="type" class="font-medium mb-1">Poll type</label>
		<Select
			id="type"
			name="type"
			className="w-full"
			bind:value={pollType}
			items={[...pollTypes]}
			on:change={() => {
				answers = [
					{
						id: Math.random().toString(16).slice(2),
						label: ''
					}
				];
			}}
		/>
	</div>
	<label for="maxChoice" class="font-medium mb-1">Maximum Choices</label>
	<Input
		type="number"
		min={1}
		value={initialData?.maxChoice}
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
								const idx = answers.findIndex((a) => a.id === answer.id);
								answers.splice(idx, 1);
								answers = answers;
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
									const idx = answers.findIndex((a) => a.id === answer.id);
									answers.splice(idx, 1);
									answers = answers;
								}}
							/>
						{/if}
						<ClickToUploadButton
							bind:image={answers[idx].image}
							bind:focus={answers[idx].focus}
							error={answers[idx].error}
						/>
						<input
							bind:value={answers[idx].label}
							name={`answers.text.${answers[idx].id}`}
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
	<hr class="my-6 border-b border-surface-700" />
	<h2 class="font-semibold mb-2">Settings</h2>
	<label class="mb-1" for="identifyVoteBy">Identify Vote by</label>
	<Select
		id="identifyVoteBy"
		name="identifyVoteBy"
		value={initialData?.identifyVoteBy}
		items={[
			{
				label: 'One vote per browser session',
				value: 'cookie session'
			},
			{
				label: 'One vote per IP address',
				value: 'ip'
			},
			{
				label: 'One vote per pollpy account',
				value: 'free user'
			}
		]}
	/>
	<hr class="my-4 border-transparent" />
	<ToggleBlock>
		<button
			type="button"
			slot="trigger"
			let:toggle
			let:open
			on:click={toggle}
			class="flex flex-row gap-2 items-center w-full text-left text-primary-700 transition enabled:hover:text-primary-600 focus-visible:text-primary-600 outline-none font-medium"
		>
			<svg
				class="w-4 h-4 transition {open ? '-rotate-90' : 'rotate-0'}"
				xmlns="http://www.w3.org/2000/svg"
				width="256"
				height="256"
				viewBox="0 0 256 256"
				><path
					fill="currentColor"
					d="m216.49 104.49l-80 80a12 12 0 0 1-17 0l-80-80a12 12 0 0 1 17-17L128 159l71.51-71.52a12 12 0 0 1 17 17Z"
				/></svg
			>
			Show advanded settings
		</button>
		<div
			slot="content"
			class="py-3 flex flex-col md:flex-row w-full gap-4 md:divide-x md:divide-surface-700"
		>
			<div class="flex flex-col gap-4 md:flex-1 pr-3 text-surface-100">
				<div class="flex flex-col gap-4">
					<ToggleBlock open={!!initialData?.closedAt}>
						<div
							slot="trigger"
							let:toggle={toggleClosedDate}
							class="flex flex-row justify-between items-center"
							let:isOpen
						>
							<p>Close poll on a scheduled date</p>
							<Checkbox id="toggleClosedDate" isChecked={isOpen} on:change={toggleClosedDate} />
						</div>
						<div slot="content" let:isOpen>
							<DateTimePicker
								id="closedAt"
								name="closedAt"
								required={isOpen}
								initialDate={initialData?.closedAt || undefined}
							/>
						</div>
					</ToggleBlock>
					<div class="flex flex-row justify-between">
						<label for="hideShareButton">Hide share button</label>
						<Checkbox id="hideShareButton" name="hideShareButton" />
					</div>
				</div>
			</div>
			<div class="md:flex-1 md:pl-3">
				<label for="resultVisibility" class="mb-1">Result visibility</label>
				<Select
					value={initialData?.resultVisibility || undefined}
					id="resultVisibility"
					name="resultVisibility"
					className="w-full"
					items={resultVisibilityOptions}
				/>
			</div>
		</div>
	</ToggleBlock>
	<hr class="my-6 border-transparent" />
	<div class="flex md:flex-row flex-col gap-5">
		<slot name="actions" />
	</div>
</form>
