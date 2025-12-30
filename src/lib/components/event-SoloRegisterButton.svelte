<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import type { Event, User } from '$lib/types';

	export let event: Event;
	export let user: User | null;
	export let paymentFunc: Function;

	let loading = false;
	let error = '';
	let success = '';

	async function register() {
		loading = true;
		error = '';
		success = '';

		const accessToken = localStorage.getItem('accessToken');
		if (!accessToken) {
			error = 'You must be logged in.';
			loading = false;
			return;
		}

		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify({ eventId: event.id })
			});

			const data = await res.json();

			if (!res.ok) {
				// Display any backend message (like "Already registered", "Event full")
				error = data?.message || 'Registration failed';
			} else {
				if (!event.fee) {
					success = 'Successfully registered!';
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
</script>

<div class="flex h-full w-full flex-col items-start justify-start gap-y-2 overflow-hidden p-4">
	<!-- User Info -->
	{#if user}
		<div class="flex gap-x-2 max-sm:flex-col">
			<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Name:</h3>
			<p class="text-lg">{user.name}</p>
		</div>
		<div class="flex gap-x-2 max-sm:flex-col">
			<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Email:</h3>
			<p class="text-lg">{user.email}</p>
		</div>
		<div class="flex gap-x-2 max-sm:flex-col">
			<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Department:</h3>
			<p class="text-lg">{user.department}</p>
		</div>
		<div class="flex gap-x-2 max-sm:flex-col">
			<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Batch:</h3>
			<p class="text-lg">{user.batch}</p>
		</div>
		<div class="flex gap-x-2 max-sm:flex-col">
			<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Graduation Year:</h3>
			<p class="text-lg">{user.year}</p>
		</div>
	{/if}

	<!-- Registration Button -->
	<div class="mt-6 flex w-full items-center justify-center">
		<button
			on:click={register}
			disabled={loading}
			class="cursor-pointer border-1 border-black bg-[#ffffff] px-6 py-3 text-black ease-in-out hover:bg-[#222222] hover:text-white disabled:opacity-50"
		>
			{#if loading}
				Registering...
			{:else if event.fee}
				Pay and Register
			{:else}
				Register
			{/if}
		</button>
	</div>

	<!-- Feedback -->
	{#if error}
		<p class="mt-2 text-red-500">{error}</p>
	{/if}
	{#if success}
		<p class="mt-2 text-green-500">{success}</p>
	{/if}
</div>
