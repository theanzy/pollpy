<script lang="ts">
	import { clickOutside } from '$lib/clickoutside';
	import { sharePollModalStore } from '$lib/modalStore';
	import createPopperAction from '$lib/popover';
	import Modal from './Modal.svelte';
	let copyTooltipOpen = false;
	let timeout: NodeJS.Timeout | undefined = undefined;

	$: {
		if (copyTooltipOpen) {
			if (timeout) {
				clearInterval(timeout);
			}
			timeout = setTimeout(() => {
				copyTooltipOpen = false;
			}, 1000);
		}
	}

	const [usePopperTrigger, usePopperContent] = createPopperAction();

	function handleCopy(value: string) {
		navigator.clipboard.writeText(value);
	}
</script>

<Modal bind:open={$sharePollModalStore.open} closeButton>
	<div
		class="lg:w-[50dvw]"
		use:clickOutside={() => {
			$sharePollModalStore.open = false;
		}}
	>
		<h2 class="pt-4 px-6 flex flex-row gap-2 items-center font-semibold text-xl">
			<svg
				class="w-6 h-6"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="M18 22q-1.25 0-2.125-.875T15 19q0-.175.025-.363t.075-.337l-7.05-4.1q-.425.375-.95.588T6 15q-1.25 0-2.125-.875T3 12q0-1.25.875-2.125T6 9q.575 0 1.1.213t.95.587l7.05-4.1q-.05-.15-.075-.337T15 5q0-1.25.875-2.125T18 2q1.25 0 2.125.875T21 5q0 1.25-.875 2.125T18 8q-.575 0-1.1-.212t-.95-.588L8.9 11.3q.05.15.075.338T9 12q0 .175-.025.363T8.9 12.7l7.05 4.1q.425-.375.95-.587T18 16q1.25 0 2.125.875T21 19q0 1.25-.875 2.125T18 22m0-16q.425 0 .713-.287T19 5q0-.425-.288-.712T18 4q-.425 0-.712.288T17 5q0 .425.288.713T18 6M6 13q.425 0 .713-.288T7 12q0-.425-.288-.712T6 11q-.425 0-.712.288T5 12q0 .425.288.713T6 13m12 7q.425 0 .713-.288T19 19q0-.425-.288-.712T18 18q-.425 0-.712.288T17 19q0 .425.288.713T18 20m0-1"
				/>
			</svg>
			Share
		</h2>
		<hr class="my-4 border-b border-transparent border-b-surface-700" />
		<div class="px-4 pb-4">
			<h3 class="text-lg font-medium text-surface-100 flex flex-row items-center gap-2">
				Share via link
				<svg
					class="w-4 h-4"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M15.729 3.884c1.434-1.44 3.532-1.47 4.693-.304c1.164 1.168 1.133 3.28-.303 4.72l-2.423 2.433a.75.75 0 0 0 1.062 1.059l2.424-2.433c1.911-1.919 2.151-4.982.303-6.838c-1.85-1.857-4.907-1.615-6.82.304L9.819 7.692c-1.911 1.919-2.151 4.982-.303 6.837a.75.75 0 1 0 1.063-1.058c-1.164-1.168-1.132-3.28.303-4.72z"
					/><path
						fill="currentColor"
						d="M14.485 9.47a.75.75 0 0 0-1.063 1.06c1.164 1.168 1.133 3.279-.303 4.72l-4.847 4.866c-1.435 1.44-3.533 1.47-4.694.304c-1.164-1.168-1.132-3.28.303-4.72l2.424-2.433a.75.75 0 0 0-1.063-1.059l-2.424 2.433c-1.911 1.92-2.151 4.982-.303 6.838c1.85 1.858 4.907 1.615 6.82-.304l4.847-4.867c1.911-1.918 2.151-4.982.303-6.837"
					/></svg
				>
			</h3>
			<p class="text-sm text-surface-300">Copy the link below to share the poll.</p>
			<div class="rounded mt-3 flex flex-row overflow-none">
				<input
					type="text"
					class="text w-full px-3 py-2 outline-none bg-surface-700 rounded-s transition focus:ring-1 ring-primary-600"
					value={$sharePollModalStore.params?.['link']}
					on:click={(e) => {
						e.currentTarget.select();
					}}
					on:keydown={(e) => {
						if (e.key !== 'Tab') {
							e.preventDefault();
						}
					}}
				/>

				{#if copyTooltipOpen}
					<div
						use:usePopperContent={{
							params: {
								placement: 'top',
								modifiers: [
									{
										name: 'offset',
										options: {
											offset: [-2, 5]
										}
									}
								]
							}
						}}
						class="py-2 px-4 text-surface-50 text-sm rounded bg-black shadow"
					>
						Copied
					</div>
				{/if}

				<button
					type="button"
					use:usePopperTrigger={{
						onClick() {
							copyTooltipOpen = true;
						}
					}}
					on:click={() => handleCopy($sharePollModalStore.params?.['link'] ?? '')}
					aria-label="copy poll link"
					class="flex flex-row items-center justify-center px-4 rounded-e bg-surface-500 text-surface-100 outline-none transition focus-visible:ring-2 ring-primary-700 enabled:hover:bg-surface-400 enabled:hover:text-white"
				>
					<svg
						class="w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593c.734-.737 1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.601 3.601 0 0 0 15.24 2"
						/><path
							fill="currentColor"
							d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847c.843.847.843 2.21.843 4.936v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z"
						/></svg
					>
				</button>
			</div>
			<hr class="my-6 border-b border-transparent border-b-surface-700" />
			<button
				type="button"
				on:click={() => {
					$sharePollModalStore.open = false;
				}}
				class="rounded flex flex-row justify-center py-2 w-full bg-surface-700 text-surface-50 outline-none transition focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 ring-surface-400 enabled:hover:bg-surface-600 enabled:hover:text-white"
			>
				Close
			</button>
		</div>
	</div>
</Modal>
