<!-- routes/signup/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import GoogleButton from '$lib/components/GoogleButton.svelte';
	import Input from '$lib/components/Input.svelte';
	import toast from 'svelte-french-toast';

	export let form;
	$: {
		console.log('formmessage', form?.message);
		if (form?.message) {
			toast.error(form?.message);
		}
	}
</script>

<div class="max-w-5xl px-5 md:px-0 flex flex-row justify-center items-center w-full">
	<div class="w-full max-w-lg">
		<h1 class="text-surface-50 text-3xl font-semibold text-center mb-3">Sign up</h1>
		<form method="post" class="flex flex-col gap-1 mx-auto" use:enhance>
			<label for="username">Username</label>
			<Input name="username" id="username" class="mb-2" required />
			<label for="password">Password</label>
			<Input type="password" name="password" id="password" class="mb-6" required />
			<button
				type="submit"
				class="rounded-sm bg-primary-600 text-surface-50 py-1 px-3 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-1 outline-none focus-visible:ring-offset-surface-900 transition enabled:hover:text-white enabled:hover:bg-primary-700 enabled:focus-visible:bg-primary-700"
			>
				Sign up
			</button>
		</form>
		<hr class="border-transparent border-b border-b-surface-800 my-5" />
		<GoogleButton />
		<div class="mt-4 w-full text-right">
			<p class="text-sm text-right">
				Already have an account?
				<a
					href="/login"
					class="ml-1 text-center text-primary-700 font-medium transition hover:text-primary-600"
					>Sign in</a
				>
			</p>
		</div>
	</div>
</div>
