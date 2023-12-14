<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';

	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import Select from '$lib/components/Select.svelte';
	import CheckmarkIcon from '$lib/components/icons/Checkmark.svelte';
	import PictureIcon from '$lib/components/icons/Picture.svelte';

	let answers: {
		id: string;
		text: string;
		image?: File[];
	}[] = [
		{
			id: Math.random().toString(16).slice(2),
			text: ''
		}
	];
	const handleSubmit: SubmitFunction = async ({
		formElement,
		formData,
		action,
		cancel,
		submitter
	}) => {
		console.log('formData', Object.fromEntries(formData));
		cancel();
		// `formElement` is this `<form>` element
		// `formData` is its `FormData` object that's about to be submitted
		// `action` is the URL to which the form is posted
		// calling `cancel()` will prevent the submission
		// `submitter` is the `HTMLElement` that caused the form to be submitted

		return async ({ result, update }) => {
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
			await update();
		};
	};
</script>

<h2 class="text-2xl font-bold text-surface-50 max-w-3xl mx-auto">Create a poll</h2>
<p class="text-surface-300 mt-1 mb-5 max-w-3xl mx-auto">Fill up the fields below</p>
<form
	use:enhance={handleSubmit}
	method="POST"
	action=""
	class="border border-surface-700 bg-surface-800 rounded flex flex-col px-8 py-6 max-w-3xl mx-auto"
>
	<label for="title" class="font-medium mb-1">Title</label>
	<Input id="title" name="title" placeholder="Your question..." class="px-3 py-2" required />
	<label for="description" class="font-medium mt-5 mb-1"
		>Description <span class="text-surface-400">(optional)</span></label
	>
	<textarea
		id="description"
		name="description"
		class="rounded-sm bg-surface-700 text-surface-100 px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 ring-offset-surface-900 placeholder:text-surface-400"
	/>
	<hr class="my-6 border-b border-surface-700" />
	<label for="type" class="font-medium mb-1">Poll type</label>
	<Select
		id="type"
		name="type"
		className="mb-3"
		items={[
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
		]}
	/>
	<label for="maxChoice" class="font-medium mb-1">Maximum Choices</label>
	<Input
		type="number"
		min={1}
		max={answers.length}
		id="maxChoice"
		name="maxChoice"
		placeholder="1"
		class="px-3 py-2"
	/>
	<label for="anwers" class="font-medium mb-1 mt-3">Answers</label>
	<div class="flex flex-col gap-3 mb-4">
		{#each answers as answer, idx (answer.id)}
			<div class="relative">
				<input
					name={`answers.${idx}`}
					bind:value={answers[idx].text}
					placeholder={`Option ${idx + 1}`}
					class="rounded-sm bg-surface-700 text-surface-100 px-3 py-2 outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 ring-offset-surface-900 placeholder:text-surface-400 w-full"
					required
				/>
				{#if answers.length > 1}
					<button
						type="button"
						class="absolute top-2 right-2 outline-none w-6 h-6 transition focus-visible:ring-1 focus-visible:ring-primary-700 enabled:hover:text-primary-700 flex flex-row justify-center items-center rounded-full"
						aria-label="remove answer"
						on:click={() => {
							answers = answers.filter((a) => a.id !== answer.id);
						}}
					>
						<svg
							class="w-5 h-6"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
							/>
						</svg>
					</button>
				{/if}
			</div>
		{/each}
	</div>
	<button
		type="button"
		class="max-w-max px-3 py-2 rounded-sm font-medium text-surface-50 bg-surface-700 outline-none transition focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 focus-visible:ring-primary-700 enabled:hover:text-white enabled:hover:bg-surface-600"
		on:click={() => {
			answers.push({ text: '', id: Math.random().toString(16).slice(2) });
			answers = answers;
		}}
	>
		Add Answer
	</button>
	<hr class="my-6 border-transparent" />
	<button
		type="submit"
		class="max-w-max px-6 py-2 rounded-sm font-medium text-surface-50 bg-primary-700 outline-none transition focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 focus-visible:ring-primary-700 enabled:hover:text-white enabled:hover:bg-primary-600"
	>
		Create poll
	</button>
</form>
