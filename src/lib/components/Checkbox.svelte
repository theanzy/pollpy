<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// your script goes here
	export let name: string | undefined = undefined;
	export let id: string | undefined = undefined;
	const dispatch = createEventDispatcher<{
		change: boolean;
	}>();
</script>

<label
	class="block rounded-full max-w-max cursor-pointer [&:has(:active)]:ring-2 [&:focus-within]:ring-2 ring-white transition relative"
>
	<input
		type="checkbox"
		width="0"
		height="0"
		class="absolute peer/checkbox opacity-0 top-3"
		on:change={(e) => {
			dispatch('change', e.currentTarget.checked);
		}}
		{id}
		{name}
	/>
	<div
		class="w-16 h-7 bg-surface-600 transition peer-checked/checkbox:bg-primary-700 rounded-full"
	></div>
	<span
		class="w-6 h-6 absolute top-[2px] left-[2px] bg-white rounded-full transition peer-checked/checkbox:translate-x-9"
	/>
</label>
