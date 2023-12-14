<script lang="ts">
	import createPopperAction from '$lib/popover';
	import { cn } from '$lib/utils';
	import type { ComponentType } from 'svelte';
	import { fade } from 'svelte/transition';

	const [usePopperTrigger, usePopperContent] = createPopperAction();

	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let items: { icon?: ComponentType; label: string; value: string }[];
	export let className: string = '';

	let select: HTMLSelectElement;
	let value: string;
	let expanded = false;
	$: selectedItem = items.find((i) => i.value === value);

	function focus(el: HTMLElement, selected: boolean) {
		function handleMouseEnter(e: MouseEvent) {
			const target = e.target as HTMLElement;
			target.focus();
		}
		el.addEventListener('mouseenter', handleMouseEnter);
		if (selected) {
			el.focus();
		}
		return {
			destroy() {
				el.removeEventListener('mouseenter', handleMouseEnter);
			}
		};
	}

	function handleKeySelect(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		if (e.key === 'Escape') {
			expanded = false;
		}
		if (e.key === 'Tab') {
			e.preventDefault();
			e.stopPropagation();
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			e.stopPropagation();
			const previousSibling = target.previousElementSibling as HTMLElement;
			if (previousSibling) {
				previousSibling.focus();
			} else {
				const lastChild = target.parentElement?.lastElementChild as HTMLElement;
				lastChild.focus();
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();
			const nextSibling = target.nextElementSibling as HTMLElement;
			if (nextSibling) {
				nextSibling.focus();
			} else {
				const firstChild = target.parentElement?.firstChild as HTMLElement;
				firstChild.focus();
			}
		}
	}
</script>

<button
	type="button"
	class={cn(
		'px-3 py-2 cursor-default font-medium bg-surface-700 rounded text-left outline-none transition flex flex-row items-center focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 focus-visible:ring-primary-700',
		className
	)}
	use:usePopperTrigger={{
		onClick() {
			expanded = !expanded;
		}
	}}
>
	<svelte:component this={selectedItem?.icon} class="w-6 h-6 mr-2" />
	{selectedItem?.label}
	<span class="ml-auto">
		<svg
			class="w-6 h-6"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			><path
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				d="M8.25 15L12 18.75L15.75 15m-7.5-6L12 5.25L15.75 9"
			/></svg
		>
	</span>
</button>
{#if expanded}
	<ul
		role="listbox"
		aria-expanded={expanded}
		use:usePopperContent={{
			params: {
				placement: 'bottom-start',
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [0, 4]
						}
					}
				]
			},
			onClickOutside() {
				expanded = false;
			}
		}}
		transition:fade={{
			duration: 200
		}}
		on:keydown={handleKeySelect}
		class="bg-surface-900 rounded py-1 border border-surface-600 max-h-40 overflow-hidden"
	>
		{#each items as item (item.value)}
			{@const selected = value === item.value}
			<li
				tabindex="0"
				role="option"
				use:focus={selected}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						select.value = item.value;
						value = item.value;
						expanded = false;
					}
				}}
				on:click={() => {
					select.value = item.value;
					value = item.value;
					expanded = false;
				}}
				aria-selected={selected}
				aria-label={item.label}
				class="relative flex flex-row items-center font-medium px-4 py-2 select-none outline-none transition focus:bg-primary-700 focus:text-white"
			>
				<svelte:component this={item.icon} class="w-6 h-6 mr-2" />
				<span>{item.label}</span>
				{#if selected}
					<span class="ml-auto mr-1">
						<svg
							class="w-5 h-5"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"
							/>
						</svg>
					</span>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<select {id} {name} bind:this={select} bind:value hidden>
	{#each items as item (item.value)}
		<option value={item.value}>{item.label}</option>
	{/each}
</select>
