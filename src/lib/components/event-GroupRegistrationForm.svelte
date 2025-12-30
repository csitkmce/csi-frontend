<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import type { Event, User } from '$lib/types';
	import { onMount } from 'svelte';
	import { isLoggedin } from '$lib/stores/auth';

	let { event, user, paymentFunc }: { event: Event; user: User | null; paymentFunc: Function } =
		$props();

	let isCreate = $state(true);
	let teamName = $state('');
	let teamCode = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state('');
	let teamMembers = $state<{ name: string; email: string }[]>([]);
	let accList = $state<{ accommodation_id: number; accommodation: string }[]>([]);
	const foodOptions = ['Non-Veg', 'Veg'];
	let selecteCreateAcc = $state<number | null>(null);
	let selecteJoinAcc = $state<number | null>(null);
	let selectedCreateFoodOpt = $state<number | null>(null);
	let selectedJoinFoodOpt = $state<number | null>(null);

	onMount(async () => {
		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/accommodation/`);
			if (res.ok) {
				const data = await res.json();
				accList = data.map((a: { accommodation_id: number; accommodation: string }) => ({
					accommodation_id: a.accommodation_id,
					accommodation: a.accommodation
				}));
			}
		} catch (err) {
			console.error('Failed to load departments', err);
		}
	});

	function toggleMode(mode: 'create' | 'join') {
		isCreate = mode === 'create';
		error = '';
		success = '';
		teamMembers = [];
	}

	async function register() {
		loading = true;
		error = '';
		success = '';

		if (teamName.trim() === '' && isCreate) {
			error = 'Enter a valid a Team name';
			loading = false;
			return;
		}

		if (teamCode.trim() === '' && !isCreate) {
			error = 'Enter a valid a Team code';
			loading = false;
			return;
		}

		const accessToken = localStorage.getItem('accessToken');
		if (!accessToken) {
			error = 'You must be logged in.';
			loading = false;
			return;
		}

		const endpoint = isCreate ? '/api/register' : '/api/register/join-team';
		const body = isCreate
			? {
					eventId: event.id,
					teamName,
					accommodationId: selecteCreateAcc,
					foodPref: selectedCreateFoodOpt
				}
			: {
					eventId: event.id,
					teamCode,
					accommodationId: selecteJoinAcc,
					foodPref: selectedJoinFoodOpt
				};

		if ((!selecteCreateAcc && isCreate) || (!selecteJoinAcc && !isCreate)) {
			error = 'Enter valid hostel info';
			loading = false;
			return;
		}

		try {
			const res = await fetch(`${PUBLIC_API_URL}${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify(body)
			});

			const data = await res.json();

			if (!res.ok) {
				error = data?.message || 'Registration failed';
			} else {
				if (!event.fee) {
					success = isCreate ? 'Team created successfully!' : 'Joined team successfully!';
					setTimeout(() => goto('/'), 1000);
				} else {
					console.log('data: ', data.data.registrationId);
					await paymentFunc(data.data.registrationId);
				}
			}
		} catch (err: any) {
			error = err?.message || 'Something went wrong.';
		} finally {
			loading = false;
		}
	}

	async function checkTeam() {
		error = '';
		success = '';
		teamMembers = [];

		const accessToken = localStorage.getItem('accessToken');
		if (!teamCode) {
			error = 'Please enter a team code.';
			return;
		}

		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/register/teams/${teamCode}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			});

			if (!res.ok) {
				error = 'Invalid team code.';
				return;
			}

			const data = await res.json();
			teamMembers = Array.isArray(data.data.members) ? data.data.members : [];
			success = 'Team found!';
		} catch {
			error = 'Could not fetch team details.';
		}
	}
</script>

<div class="flex h-full w-full flex-col items-start justify-start gap-y-2 overflow-hidden p-4">
	<!-- User Info -->
	{#if user}
		<div class="flex gap-x-2 max-sm:flex-col">
			<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Name:</h3>
			<p class="text-lg">{user?.name}</p>
		</div>
		<div class="flex gap-x-2 max-sm:flex-col">
			<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Email:</h3>
			<p class="text-lg">{user?.email}</p>
		</div>
		<div class="flex gap-x-2 max-sm:flex-col">
			<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Department:</h3>
			<p class="text-lg">{user?.department}</p>
		</div>
		<div class="flex gap-x-2 max-sm:flex-col">
			<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Batch:</h3>
			<p class="text-lg">{user?.batch}</p>
		</div>
		<div class="flex gap-x-2 max-sm:flex-col">
			<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Graduation Year:</h3>
			<p class="text-lg">{user?.year}</p>
		</div>
	{/if}

	{#if !event.isRegistered}
		<!-- Mode Toggle -->
		<div class="mt-2 flex w-full items-center gap-1 rounded-md bg-[#404040] p-1">
			<button
				onclick={() => toggleMode('create')}
				class="w-full rounded {isCreate ? 'bg-[#222222]' : ''} p-1"
			>
				Create Team
			</button>
			<button
				onclick={() => toggleMode('join')}
				class="w-full rounded {!isCreate ? 'bg-[#222222]' : ''} p-1"
			>
				Join Team
			</button>
		</div>

		<!-- Registration Form -->
		<div class="w-full rounded-lg bg-[#303030] p-2">
			{#if isCreate}
				<form class="flex flex-col items-center">
					<div class="flex w-full flex-col px-2">
						<ul class="ml-4 list-disc space-y-2">
							<li><p>On creating a team, you get a unique team code</p></li>
							<li><p>You will be the team leader</p></li>
							<li><p>Others can use this code to join your team</p></li>
						</ul>
						<label for="teamName" class="mt-4 mb-2">Enter your team name below:</label>
						<input
							id="teamName"
							name="teamName"
							placeholder="Team name"
							bind:value={teamName}
							class="h-8 w-full rounded bg-[#505050] p-2"
							type="text"
						/>
						<label for="teamName" class="mt-4 mb-2">Hostel Information:</label>
						<select
							id="accOptions"
							bind:value={selecteCreateAcc}
							name="department"
							class="flex h-8 w-full items-center rounded bg-[#505050]"
						>
							{#each accList as acc}
								<option value={acc.accommodation_id}>{acc.accommodation}</option>
							{/each}
						</select>
						{#if event.food}
							<label for="teamName" class="mt-4 mb-2">Food option:</label>
							<select
								id="accOptions"
								bind:value={selectedCreateFoodOpt}
								name="department"
								class="flex h-8 w-full items-center rounded bg-[#505050]"
							>
								{#each foodOptions as option}
									<option value={option}>{option}</option>
								{/each}
							</select>
						{/if}
					</div>
					<div class="flex w-full items-center justify-center">
						<button
							onclick={(e) => {
								e.preventDefault();
								if (!user) {
									goto('/login');
									return;
								}
								register();
							}}
							class="m-4 cursor-pointer border-1 border-black bg-[#ffffff] px-6 py-3 text-black ease-in-out hover:bg-[#222222] hover:text-white disabled:opacity-50"
							disabled={loading}
						>
							{#if loading}
								Creating...
							{:else if event.fee}
								Pay and Create Team
							{:else}
								Create Team
							{/if}
						</button>
					</div>
				</form>
			{:else}
				<form class="flex flex-col items-center">
					<div class="flex w-full flex-col px-2">
						<label for="teamCode" class="mt-4 mb-2">Enter team code below:</label>
						<div class="flex items-center gap-x-2">
							<input
								id="teamCode"
								name="teamCode"
								placeholder="Team code"
								bind:value={teamCode}
								class="h-8 w-full rounded bg-[#505050] p-2"
								type="text"
							/>
							<button
								onclick={async (e) => {
									e.preventDefault();
									if (!user) {
										goto('/login');
										return;
									}
									await checkTeam();
								}}
								class="h-8 cursor-pointer rounded bg-[#222222] px-3"
							>
								Check
							</button>
						</div>
						<label for="teamName" class="mt-4 mb-2">Hostel Information:</label>
						<select
							id="accJoinOptions"
							bind:value={selecteJoinAcc}
							name="department"
							class="flex h-8 w-full items-center rounded bg-[#505050]"
						>
							{#each accList as acc}
								<option value={acc.accommodation_id}>{acc.accommodation}</option>
							{/each}
						</select>
						{#if event.food}
							<label for="teamName" class="mt-4 mb-2">Food option:</label>
							<select
								id="accOptions"
								bind:value={selectedJoinFoodOpt}
								name="department"
								class="flex h-8 w-full items-center rounded bg-[#505050]"
							>
								{#each foodOptions as option}
									<option value={option}>{option}</option>
								{/each}
							</select>
						{/if}
					</div>

					<div class="mt-8 w-full px-2">
						<p class="text-lg">Team members</p>
						<ul class="text-md mt-2 ml-4 list-disc space-y-2">
							{#if teamMembers.length > 0}
								{#each teamMembers as member}
									<li><p>{member.name} ({member.email})</p></li>
								{/each}
							{:else}
								<li><p>No members found yet.</p></li>
							{/if}
						</ul>
					</div>

					<div class="flex w-full items-center justify-center">
						<button
							onclick={(e) => {
								e.preventDefault();
								if (!user) {
									goto('/login');
									return;
								}
								register();
							}}
							class="m-4 cursor-pointer border-1 border-black bg-[#ffffff] px-6 py-3 text-black ease-in-out hover:bg-[#222222] hover:text-white disabled:opacity-50"
							disabled={loading}
						>
							{#if loading}Joining...{:else}Join Team{/if}
						</button>
					</div>
				</form>
			{/if}

			<!-- Feedback -->
			{#if error}
				<p class="mt-2 text-red-500">{error}</p>
			{/if}
			{#if success}
				<p class="mt-2 text-green-500">{success}</p>
			{/if}
		</div>
	{:else}
		<div class="flex w-full flex-col items-center gap-y-5 rounded-lg bg-[#303030] p-5">
			<p class="text-lg font-bold">Registered</p>
			<p class="text-justify text-sm text-[#808080]">
				You have already registered for this event. Visit Home page to see full details
			</p>
		</div>
	{/if}
</div>
