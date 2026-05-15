<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { EXECOM_CALL_ACTIVE } from '$lib/constants';
	import type { UserRaw, LoadedData } from '$lib/types';
	import { Check, Loader } from '@lucide/svelte';
	import { error } from '@sveltejs/kit';

	let user: LoadedData<UserRaw> = $state({
		state: 'pending',
		message: 'Loading user...'
	});

	const positions = [
		'Program Coordinator',
		'Documentation',
		'Media team',
		'Publicity',
		'Tech team',
		'Volunteer',
		'Design team'
	];

	let pref1 = $state('');
	let pref2 = $state('');
	let pref3 = $state('');
	let reason = $state('');
	let errorText = $state('');
	let isSubLoading = $state(false);
	let submitSuccess = $state(false);

	$effect(() => {
		if (EXECOM_CALL_ACTIVE) {
			(async () => {
				const accessToken: string = localStorage.getItem('accessToken')!;
				try {
					const res = await fetch(`${PUBLIC_API_URL}/api/user`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${accessToken}`
						}
					});
					const data = await res.json();
					if (data.requiresLogin) {
						goto('/login');
					}

					if (!res.ok) {
						const error = await data.catch(() => ({}));
						console.log(error);
						throw new Error(error.message);
					}

					user = {
						state: 'success',
						data: data
					};
					isSubLoading = false;
					submitSuccess = false;
				} catch (error) {
					user = {
						state: 'failed',
						message: 'Failed to load users'
					};
					errorText = error as string;
					console.error(error);
				}
			})();
		}
	});

	async function handleSubmit() {
		errorText = '';
		try {
			isSubLoading = true;
			if (pref1 === '' || pref2 === '' || pref3 === '') {
				errorText = 'Please fill in all preferences';
				return;
			}
			if (reason === '') {
				errorText = 'Please enter a reason in the space provided';
				return;
			}
			const accessToken: string = localStorage.getItem('accessToken')!;
			const res = await fetch(`${PUBLIC_API_URL}/api/execom/application`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify({
					preference1: pref1,
					preference2: pref2,
					preference3: pref3,
					answer: reason
				})
			});
			const data = await res.json().catch(() => {});
			if (!res.ok) {
				if (res.status === 400) {
					errorText = data.message;
				}
				if (res.status === 401) {
					errorText = 'Session out. Log in and try again';
				}
			}
			submitSuccess = true;
		} catch (error) {
			console.error(error);
		} finally {
			isSubLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Execom Call - CSI TKMCE</title>
</svelte:head>

{#if EXECOM_CALL_ACTIVE}
	<div class="flex w-full max-w-7xl flex-col items-center border-x border-[#181818]">
		<div class="flex h-40 w-full items-center justify-center">
			<h1 class="text-3xl">Execom Call</h1>
		</div>
		<div class="flex w-full flex-col items-center gap-y-4 border-t border-[#181818]">
			<div class="relative inset-0 flex max-w-250 items-center gap-4 p-4 max-sm:flex-col">
				<div class="border border-black bg-neutral-700 p-1 shadow-[4px_4px_0_0_black]">
					<img
						class="max-w-80"
						src="images/execom-call/execom-call-poster.jpeg"
						alt="execom-call-poster"
					/>
				</div>
				<div class="flex flex-col gap-y-4 text-justify font-sans text-sm text-neutral-400">
					<p>
						Are you passionate about technology, innovation, leadership, and teamwork? Here’s your
						opportunity to become a part of the vibrant community at CSI TKMCE!
					</p>
					<p>
						The <span class="font-bold text-neutral-200"
							>Computer Society of India (CSI) TKMCE Chapter</span
						>
						is looking for motivated, creative, and dedicated students to join the
						<span class="font-bold text-neutral-200">Executive Committee</span>
						for the academic year <span class="font-bold text-neutral-200">2026–27</span>.
					</p>
					<p>
						Being part of the ExeCom is more than just organizing events — it is an opportunity to
						learn, grow, and develop valuable skills that go beyond the classroom.
					</p>
					<p>
						Whether you are interested in technical activities, design, content creation, event
						management, marketing, social media, or coordination — there’s a place for you in the
						CSI family!
					</p>
					<p>
						Ready to join the team?<br />
						Fill in your details below and
						<span class="font-bold text-neutral-200">register now</span>!
					</p>
				</div>
			</div>
			<div class="border-t border-[#181818]"></div>
			<div class="flex w-full flex-col gap-y-4 p-4">
				<h3 class="text-lg font-bold uppercase">Fill in your preferences</h3>
				<div class="flex gap-4 max-sm:flex-col">
					<div class="flex w-full flex-col gap-y-4 border-2 border-stone-700 p-4 text-neutral-400">
						{#if user.state === 'pending'}
							<p>Loading user details</p>
						{:else if user.state === 'success'}
							<div class="flex flex-col">
								<p class="text-xs">Name</p>
								<p class="font-bold">{user.data.userName}</p>
							</div>
							<div class="flex flex-col">
								<p class="text-xs">Email</p>
								<p class="font-bold">{user.data.userEmail}</p>
							</div>
							<div class="flex flex-col">
								<p class="text-xs">Contact</p>
								<p class="font-bold">{user.data.phoneNumber}</p>
							</div>
							<div class="flex flex-col">
								<p class="text-xs">Department</p>
								<p class="font-bold">{user.data.department}</p>
							</div>
							<div class="flex flex-col">
								<p class="text-xs">Graduation year</p>
								<p class="font-bold">{user.data.year}</p>
							</div>
							<div class="flex flex-col">
								<p class="text-xs">Batch</p>
								<p class="font-bold">{user.data.batch}</p>
							</div>
						{:else}
							<p>Failed to load user details</p>
						{/if}
					</div>
					<div class="flex w-full flex-col gap-y-4 border-2 border-stone-700 p-4 text-neutral-400">
						{#if errorText}
							<p class="text-red-400">{errorText}</p>
						{/if}
						<div class="flex flex-col">
							<p>First Preference*</p>
							<select bind:value={pref1} class="bg-neutral-700 px-2 py-1">
								{#each positions as position}
									<option value={position}>{position}</option>
								{/each}
							</select>
						</div>
						<div class="flex flex-col">
							<p>Second Preference*</p>
							<select bind:value={pref2} class="bg-neutral-700 px-2 py-1">
								{#each positions as position}
									<option value={position}>{position}</option>
								{/each}
							</select>
						</div>
						<div class="flex flex-col">
							<p>Third Preference*</p>
							<select bind:value={pref3} class="bg-neutral-700 px-2 py-1">
								{#each positions as position}
									<option value={position}>{position}</option>
								{/each}
							</select>
						</div>
						<div class="flex flex-col">
							<p>Why you want to be an Execom Member?</p>
							<textarea bind:value={reason} class="min-h-20 bg-neutral-700 px-2 py-1"></textarea>
						</div>
						<div class="mt-auto flex justify-center">
							<button
								disabled={isSubLoading}
								onclick={handleSubmit}
								class={`flex w-min items-center justify-center ${submitSuccess ? 'bg-green-800 text-white' : 'bg-blue-800 text-blue-400'} px-2 py-2 max-sm:w-full`}
								>{submitSuccess ? 'Subitted' : 'Submit'}
								{#if isSubLoading}
									<Loader class="animate-spin" size="18" />
								{:else if submitSuccess}
									<Check size="18" />
								{/if}</button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="relative top-20 flex h-screen w-full flex-col items-center">
		<h2 class="text-2xl font-bold">404</h2>
		<p class="text-lg">Not Found</p>
	</div>
{/if}
