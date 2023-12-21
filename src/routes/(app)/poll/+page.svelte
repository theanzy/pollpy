<script lang="ts">
	import CreatePollButton from '$lib/components/CreatePollButton.svelte';

	export let data;
</script>

{#if data.polls}
	<div class="mx-auto max-w-5xl">
		<table class="w-full table-auto">
			<thead class="font-semibold [&>td]:py-2 [&>td]:text-surface-100">
				<td class="w-[60%] px-3">Poll</td>
				<td class="px-3">Vote type</td>
				<td class="px-3">Created At</td>
			</thead>
			<tbody>
				{#each data.polls as poll (poll.id)}
					<tr class="[&>td]:px-3 [&>td]:py-1.5">
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
	</div>
{:else}
	<div class="text-center mt-5 flex flex-col items-center">
		<h2 class="text-2xl font-semibold text-surface-100">No polls found</h2>
		<p class="mt-1 text-surface-300 text-sm mb-5">You don't have any polls yet.</p>
		<CreatePollButton />
	</div>
{/if}
