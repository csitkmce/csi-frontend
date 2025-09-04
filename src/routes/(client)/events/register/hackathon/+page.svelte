<script lang="ts">
	import type { Event, User } from '$lib/types';
	let isCreate = $state(false);

	function toggleMode(title: string) {
		isCreate = title === 'create';
	}

	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { isLoggedin } from '$lib/stores/auth';

	let details: {
		event?: Event;
		user?: User;
	} = $state({});

	$effect(() => {
		async function fetchData() {
			const searchParams = $page.url.searchParams;
			const id = searchParams.get('id');

			const accessToken = localStorage.getItem('accessToken');

			if (!accessToken) {
				await invalidateAll();
				await goto('/login');
			}

			try {
				const res = await fetch(`${PUBLIC_API_URL}/api/events/${id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`
					},
					credentials: 'include'
				});

				if (res.status === 401) {
					const resRefresh = await fetch(`${PUBLIC_API_URL}/api/refresh/`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						},
						credentials: 'include'
					});

					if (resRefresh.status === 401) {
						localStorage.removeItem('accessToken');
						isLoggedin.set(false);
						goto('/login');
					} else if (resRefresh.status === 200) {
						const { accessToken: newToken } = await resRefresh.json();
						localStorage.setItem('accessToken', newToken);
						isLoggedin.set(true);
						details = await resRefresh.json();
					} else {
						throw new Error('Refresh request failed');
					}
				} else if (res.status === 200) {
					isLoggedin.set(true);
					details = await res.json();
				} else {
					throw new Error('User request failed');
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				localStorage.removeItem('accessToken');
				isLoggedin.set(false);
				goto('/login');
			}
		}
		fetchData();
	});
</script>

<div class="flex w-full flex-col items-start justify-start gap-y-2 overflow-hidden p-4">
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Event Name:</h3>
		<p class="text-lg">{details.event?.name}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Name:</h3>
		<p class="text-lg">{details.user?.name}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Email:</h3>
		<p class="text-lg">{details.user?.email}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Department:</h3>
		<p class="text-lg">{details.user?.department}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Batch:</h3>
		<p class="text-lg">{details.user?.batch}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Graduation Year:</h3>
		<p class="text-lg">{details.user?.year}</p>
	</div>
	<div class="mt-2 flex w-full items-center gap-1 rounded-md bg-[#404040] p-1">
		<button
			onclick={() => {
				toggleMode('create');
			}}
			class="w-full rounded {isCreate ? 'bg-[#222222]' : ''} p-1"
		>
			Create Team
		</button>
		<button
			onclick={() => {
				toggleMode('join');
			}}
			class="w-full rounded {!isCreate ? 'bg-[#222222]' : ''} p-1"
		>
			Join Team
		</button>
	</div>
	<div class="w-full rounded-lg bg-[#303030] p-2">
		{#if isCreate}
			<form class="flex flex-col items-center">
				<div class="flex w-full flex-col px-2">
					<ul class="ml-4 list-disc space-y-2">
						<li><p>On creating a team, you get a unique team code</p></li>
						<li><p>You will be the team leader</p></li>
						<li><p>Others can use this code to join your team</p></li>
					</ul>
					<label for="email" class="mt-4 mb-2">Enter your team name below:</label>
					<input
						name="email"
						placeholder="Team name"
						class="h-8 w-full rounded bg-[#505050] p-2"
						type="email"
					/>
				</div>
				<div class="flex w-full items-center justify-center">
					<button
						class="m-4 cursor-pointer border-1 border-black bg-[#ffffff] px-6 py-3 text-black ease-in-out hover:bg-[#222222] hover:text-white"
					>
						Pay and Create Team
					</button>
				</div>
			</form>
		{:else}
			<form class="flex flex-col items-center">
				<div class="flex w-full flex-col px-2">
					<label for="email" class="mt-4 mb-2">Enter team code below:</label>
					<div class="flex items-center gap-x-2">
						<input
							name="email"
							placeholder="Team name"
							class="h-8 w-full rounded bg-[#505050] p-2"
							type="email"
						/>
						<button class="cursor-pointer rounded bg-[#222222] px-3 py-1"> Check </button>
					</div>
				</div>
				<div class="mt-8 w-full px-2">
					<p class="text-lg">Team members</p>
					<ul class="text-md mt-2 ml-4 list-disc space-y-2">
						<li><p>Team member 1</p></li>
						<li><p>Team member 2</p></li>
						<li><p>Team member 3</p></li>
					</ul>
				</div>
				<div class="flex w-full items-center justify-center">
					<button
						class="m-4 cursor-pointer border-1 border-black bg-[#ffffff] px-6 py-3 text-black ease-in-out hover:bg-[#222222] hover:text-white"
					>
						Join Team
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
