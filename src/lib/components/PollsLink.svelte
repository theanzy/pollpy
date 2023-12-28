<script>
	import { cn } from '$lib/utils';
</script>

<a
	href="/poll"
	class={cn(
		'outline-none transition focus-visible:text-primary-700 py-2 px-3 font-medium flex flex-row gap-1 md:gap-2 items-center hover:text-primary-700',
		$$restProps.class
	)}
>
	<svg
		class="w-4 h-4 md:h-5 md:w-5"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M8 17c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v5c0 .55-.45 1-1 1m4 0c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8c0 .55-.45 1-1 1m4 0c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1"
		/></svg
	>
	Polls
</a>
