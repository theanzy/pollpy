<script>
	import { enhance } from '$app/forms';
	import GoogleButton from '$lib/components/GoogleButton.svelte';
	import toast from 'svelte-french-toast';
	export let form;
	$: {
		if (form?.message) {
			toast.error(form?.message);
		}
	}
</script>

<div class="max-w-5xl px-5 md:px-0 flex flex-row justify-center items-center w-full">
	<div class="w-full max-w-lg">
		<h1 class="text-surface-50 text-3xl font-semibold text-center mb-3">Log In</h1>
		<form method="post" class="flex flex-col gap-1 mx-auto" use:enhance>
			<label for="username">Username</label>
			<input
				name="username"
				id="username"
				class="rounded-sm mb-2 bg-surface-800 text-surface-100 px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 ring-offset-surface-900"
				required
			/>
			<label for="password">Password</label>
			<input
				type="password"
				name="password"
				id="password"
				class="mb-3 rounded-sm bg-surface-800 text-surface-100 px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 ring-offset-surface-900"
				required
			/>
			<button
				type="submit"
				class="rounded-sm bg-primary-600 text-surface-50 py-1 px-3 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-1 outline-none focus-visible:ring-offset-surface-900 transition enabled:hover:text-white enabled:hover:bg-primary-700 enabled:focus-visible:bg-primary-700"
			>
				Log In
			</button>
		</form>
		<hr class="border-transparent border-b border-b-surface-800 my-5" />
		<GoogleButton />
		<div class="mt-4 w-full text-right">
			<p class="text-sm text-right">
				Don't have an account?
				<a
					href="/signup"
					class="ml-1 text-center text-primary-700 font-medium transition hover:text-primary-600"
				>
					Sign up
				</a>
			</p>
		</div>
	</div>
</div>
