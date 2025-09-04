<script lang="ts">
	import type { LeaderBoard, LoadedData } from '$lib/types.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	let leaderboard = $state<LoadedData<LeaderBoard[]>>({
		state: 'pending',
		message: 'Loading execom list'
	});

	onMount(async () => {
		try {
			leaderboard = {
				state: 'success',
				data: await data.leaderboard
			};
		} catch (error) {
			leaderboard = {
				state: 'failed',
				message: 'Failed to load'
			};
		}
	});
</script>

<svelte:head>
	<title>LeaderBoard - CSI TKMCE</title>
</svelte:head>

<div class="min-h-screen w-full max-w-7xl border-x-1 border-[#181818] bg-[#222222]">
	<section id="leaderboard" class="border-x-1 border-[#181818] p-4">
		<div class="m-4 flex flex-col border-1 border-[#181818] shadow-[4px_4px_0_0_[#181818]]">
			<h2 class="p-4 text-2xl">LeaderBoard</h2>
			<div class="overflow-auto border-t-1 border-[#181818]">
				{#if leaderboard.state === 'pending'}
					Loading
				{:else if leaderboard.state === 'success'}
					<table>
						<thead>
							<tr>
								<th scope="col" class="px-6">Rank</th>
								<th scope="col" class="w-full px-6 py-3 text-left">Name</th>
								<th scope="col" class="px-6 py-3">Points</th>
							</tr>
						</thead>
						<tbody class="text-center">
							{#each leaderboard.data as data}
								<tr class="odd:bg-[#313131] even:bg-[#454545]">
									<td class="">{data.rank}</td>
									<td class="px-6 py-3 text-left">{data.name}</td>
									<td class="px-6 py-3">{data.points}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{:else if leaderboard.state === 'failed'}
					Something went wrong
				{/if}
			</div>
		</div>
	</section>
</div>
