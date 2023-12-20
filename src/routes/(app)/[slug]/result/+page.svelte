<script lang="ts">
	import { page } from '$app/stores';
	import PieChart from '$lib/components/PieChart.svelte';
	import Progressbar from '$lib/components/Progressbar.svelte';
	import { dateMoment } from '$lib/utils.js';

	export let data;
	$: ({ pollResult } = data);
</script>

{#if pollResult}
	<div class="max-w-5xl mx-auto">
		<div class="mb-3">
			<h2 class="text-xl font-medium text-surface-100">{pollResult.poll.title}</h2>
			<p>
				by {pollResult.poll.creatorName} <span class="mx-1">·</span>
				{dateMoment(pollResult.poll.createdAt, new Date())}
			</p>
		</div>
		{#if pollResult.poll.type === 'text'}
			<div class="flex flex-col md:flex-row gap-5">
				<div class="flex-1">
					<div class="flex flex-col gap-3">
						{#each pollResult.result as vote (vote.answer.id)}
							{@const votePercent =
								pollResult.totalVotes === 0 ? 0 : (vote.count / pollResult.totalVotes) * 100}
							<div class="text-sm">
								<div class="flex flex-row gap-2 items-center justify-between mb-1">
									<p>{vote.answer.label}</p>
									<div class="flex flex-row gap-2">
										<p>{votePercent.toFixed(2)}%</p>
										<p>({vote.count} votes)</p>
									</div>
								</div>
								<Progressbar width={votePercent} />
							</div>
						{/each}
					</div>
					<hr class="mt-5 mb-3 border-transparent border-b border-b-surface-600" />
					<p>Total votes: {pollResult.totalVotes}</p>
				</div>
				<div class="md:max-h-[350px] w-auto flex justify-center mt-5 md:mt-0 px-4">
					<PieChart
						dataset={pollResult.result.map((d) => ({
							label: d.answer.label || '',
							value: d.count
						}))}
					/>
				</div>
			</div>
		{:else if pollResult.poll.type === 'image'}
			<p class="mt-4 mb-2 text-surface-100">Total votes: {pollResult.totalVotes}</p>
			<div
				class="rounded border border-surface-700 grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-surface-700 overflow-hidden"
			>
				{#each pollResult.result as vote, idx (vote.answer.id)}
					{@const imageLabel = vote.answer.label ?? `Option ${idx + 1}`}
					{@const votePercent =
						pollResult.totalVotes === 0 ? 0 : (vote.count / pollResult.totalVotes) * 100}
					<div class="flex flex-row gap-5 bg-surface-900">
						<div class="overflow-hidden w-[200px]">
							<img class="h-[150px] w-auto mx-auto" alt={imageLabel} src={vote.answer.image} />
						</div>
						<div class="flex flex-col justify-center px-4">
							<p class="text-surface-100">{imageLabel}</p>
							<p class="text-sm">
								{votePercent.toFixed(2)}% <span class="ml-1">({vote.count} votes)</span>
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<hr class="border border-transparent my-2" />
		<a
			href="/{$page.params.slug}"
			class="flex flex-row gap-1 items-center justify-center text-sm w-[150px] bg-surface-900 border border-surface-600 text-surface-50 px-4 py-2 rounded-sm outline-none transition hover:text-white hover:bg-surface-800 ring-offset-2 ring-offset-surface-950 focus-visible:ring-1 ring-surface-400"
		>
			<svg
				class="w-5 h-5"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="M11.707 5.293a1 1 0 0 1 0 1.414L7.414 11H19a1 1 0 1 1 0 2H7.414l4.293 4.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 0"
				/>
			</svg>
			Back to poll
		</a>
	</div>
{:else}
	<div class="mt-10 text-center">
		<h2 class="font-semibold text-2xl text-surface-50 mb-2">Page not found</h2>
		<p class="mb-8">This page does not exist</p>
		<a
			href="/"
			class="bg-primary-600 text-surface-50 px-4 py-2 rounded outline-none transition hover:text-white hover:bg-primary-700 focus-visible:ring-1 ring-primary-700 ring-offset-2 ring-offset-surface-950"
		>
			Go back
		</a>
	</div>
{/if}
