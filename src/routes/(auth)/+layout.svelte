<main class="my-auto min-h-[100dvh] flex justify-center items-center">
	<div class="max-w-5xl px-5 md:px-0 mx-auto w-full flex flex-col gap-2">
		<a
			href="/"
			class="max-w-lg mx-auto flex flex-row items-center gap-2 w-full mb-5 transition hover:text-primary-100 outline-none focus-visible:text-primary-100"
		>
			<svg
				class="w-5 h-5"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"><path fill="currentColor" d="M4 21V9l8-6l8 6v12h-6v-7h-4v7z" /></svg
			>

			Home
		</a>
		<div class="w-full flex flex-row justify-center items-center">
			<slot />
		</div>
	</div>
</main>
