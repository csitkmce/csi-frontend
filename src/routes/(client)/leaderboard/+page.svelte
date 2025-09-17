<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { LeaderBoard, LoadedData } from '$lib/types.js';
	import { onMount } from 'svelte';

	let leaderboard = $state<LoadedData<LeaderBoard[]>>({
		state: 'pending',
		message: 'Loading leaderboard...'
	});

	let lastUpdated = $state<string | null>(null);
	let userRegistered = $state<boolean>(true); // hide register button by default
	onMount(async () => {
		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/leaderboard/`, {
				headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
			});
			const json = await res.json();

			leaderboard = { state: 'success', data: json.leaderboard };
			lastUpdated = json.lastUpdated;
			userRegistered = json.userRegistered ?? false; // update after fetch
		} catch (err) {
			console.error(err);
			leaderboard = { state: 'failed', message: 'Failed to load leaderboard' };
		}
	});

	async function registerLeetCode() {
		const leetcodeId = prompt('Enter your LeetCode ID:');
		if (!leetcodeId) return;

		const accessToken = localStorage.getItem('accessToken');

		if (!accessToken) {
			// not logged in → redirect to login
			alert('You need to log in to register');
			window.location.href = '/login'; // adjust to your login route
			return;
		}

		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/leaderboard/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify({ leetcodeId })
			});

			if (!res.ok) {
				const error = await res.json().catch(() => ({}));
				alert('Error: ' + (error.message || 'Something went wrong'));
				return;
			}

			alert('Successfully registered! Refreshing leaderboard...');

			const refreshed = await (
				await fetch(`${PUBLIC_API_URL}/api/leaderboard/`, {
					headers: { Authorization: `Bearer ${accessToken}` }
				})
			).json();

			leaderboard = { state: 'success', data: refreshed.leaderboard };
			lastUpdated = refreshed.lastUpdated;
			userRegistered = refreshed.userRegistered;
		} catch (err) {
			console.error(err);
			alert('Failed to connect to backend');
		}
	}
</script>

<svelte:head>
	<title>LeaderBoard - CSI TKMCE</title>
</svelte:head>

<div class="min-h-screen w-full max-w-7xl border-x-1 border-[#181818] bg-[#222222]">
	<section id="leaderboard" class="border-x-1 border-[#181818] p-4">
		<div class="m-4 flex flex-col border-1 border-[#181818] shadow-[4px_4px_0_0_[#181818]]">
			<div class="flex justify-between p-4 max-md:flex-col min-md:items-center">
				<h2 class="text-2xl">LeaderBoard</h2>
				{#if lastUpdated}
					<p class="text-sm text-gray-400">Updated: {lastUpdated}</p>
				{/if}
				{#if userRegistered === null || userRegistered === false}
					<div class="flex items-center justify-end gap-4">
						{#if userRegistered === null || userRegistered === false}
							<button
								onclick={registerLeetCode}
								class="border-1 border-[#181818] bg-[#313131] px-4 py-2 text-sm hover:bg-[#454545]"
							>
								Join
							</button>
						{/if}
					</div>
				{/if}
			</div>

			<div class="flex overflow-auto border-t-1 border-[#181818]">
				{#if leaderboard.state === 'pending'}
					<div class="m-4 flex w-full animate-pulse flex-col items-center overflow-hidden">
						<div class="mb-4 flex h-10 w-full overflow-hidden bg-[#303030]"></div>
						<div class="mb-4 flex h-10 w-full overflow-hidden bg-[#303030]"></div>
						<div class="mb-4 flex h-10 w-full overflow-hidden bg-[#303030]"></div>
					</div>
				{:else if leaderboard.state === 'success'}
					<table class="w-full">
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
									<td>{data.rank}</td>
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
