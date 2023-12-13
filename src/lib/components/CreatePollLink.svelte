<script lang="ts">
	import { cn } from '$lib/utils';

	interface $$Props {
		class?: string;
	}
</script>

<a
	href="/create"
	class={cn(
		'outline-none transition focus-visible:text-primary-700 px-3 font-medium flex flex-row gap-2 items-center hover:text-primary-700',
		$$restProps.class
	)}
>
	<svg
		class="h-5 w-5"
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 20 20"
	>
		<path
			fill="currentColor"
			d="M18 10a2 2 0 0 0-2-2H4a2 2 0 1 0 0 4h12a2 2 0 0 0 2-2m-8-6a2 2 0 0 0-2-2H4a2 2 0 1 0 0 4h4a2 2 0 0 0 2-2m4 12a2 2 0 0 0-2-2H4a2 2 0 1 0 0 4h8a2 2 0 0 0 2-2"
		/>
	</svg>
	Create poll
</a>
