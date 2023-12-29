<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CreatePollButton from '$lib/components/CreatePollButton.svelte';
	import Select from '$lib/components/Select.svelte';

	export let data;
	const statusOptions = [
		{
			label: 'Active',
			value: 'active'
		},
		{
			label: 'Draft',
			value: 'draft'
		}
	];
	$: ({ polls } = data);
	let checkedIds: string[] = [];
	const status = $page.url.searchParams.get('status') ?? 'active';
</script>

<div class="mx-auto max-w-5xl">
	<Select
		on:change={(e) => {
			console.log('change', e.detail);
			if (e.detail !== status) {
				goto(`/poll?status=${e.detail}`);
			}
		}}
		value={status}
		id="status"
		name="status"
		className="bg-transparent w-full md:w-[150px] border border-surface-700 mb-3"
		items={statusOptions}
	/>
	{#if polls?.length}
		<table class="w-full table-auto">
			<thead class="font-semibold [&>td]:py-2 [&>td]:text-surface-100">
				<td class="px-3">
					<input
						on:change={() => {
							if (checkedIds.length > 0) {
								checkedIds = [];
							} else {
								checkedIds = polls?.map((p) => p.id) ?? [];
							}
						}}
						checked={checkedIds.length > 0}
						aria-label="select-all"
						class="relative float-left h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[''] checked:border-primary-600 checked:bg-primary-600 checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent"
						type="checkbox"
					/>
				</td>
				<td class="w-[60%] px-3">Poll</td>
				<td class="px-3">Vote type</td>
				<td class="px-3">Created At</td>
			</thead>
			<tbody>
				{#each polls as poll (poll.id)}
					<tr class="[&>td]:px-3 [&>td]:py-1.5">
						<td>
							<input
								aria-label="select-all"
								class="relative float-left h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[''] checked:border-primary-600 checked:bg-primary-600 checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent"
								type="checkbox"
								on:change={() => {
									const idx = checkedIds.findIndex((x) => x === poll.id);
									if (idx === -1) {
										checkedIds.push(poll.id);
									} else {
										checkedIds.splice(idx, 1);
									}
									checkedIds = checkedIds;
								}}
								checked={checkedIds.includes(poll.id)}
							/>
						</td>
						<td>
							<a
								href="/{poll.slug}"
								class="outline-none text-secondary-600 font-medium hover:text-secondary-500 focus-visible:text-secondary-500"
								>{poll.title}</a
							>
						</td>
						<td>
							{poll.identifyVoteBy}
						</td>
						<td>
							<time datetime={poll.createdAt.toISOString()}>
								{poll.createdAt.toLocaleString()}
							</time>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<div class="text-center mt-5 flex flex-col items-center">
			<h2 class="text-2xl font-semibold text-surface-100">No polls found</h2>
			<p class="mt-1 text-surface-300 text-sm mb-5">You don't have any {status ?? ''} polls yet.</p>
			<CreatePollButton />
		</div>
	{/if}
</div>
