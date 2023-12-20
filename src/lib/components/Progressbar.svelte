<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	export let width = 0;
	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});
	$: {
		$progress = width;
	}
</script>

<div class="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
	<div class="bg-secondary-600 h-3 rounded-full transition" style="width: {$progress}%" />
</div>
