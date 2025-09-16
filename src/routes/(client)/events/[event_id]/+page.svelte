<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { isLoggedin } from '$lib/stores/auth';
	import EventInfo from '$lib/components/event-EventInfo.svelte';
	import GroupRegistrationForm from '$lib/components/event-GroupRegistrationForm.svelte';
	import SoloRegisterButton from '$lib/components/event-SoloRegisterButton.svelte';
	import type { Event, User } from '$lib/types';

	let posterUrl = '';
	let error = '';
	let event: Event | null = null;
	let user: User | null = null;

	onMount(async () => {
		const eventId = $page.params.event_id;
		const accessToken = localStorage.getItem('accessToken');

		// if (!accessToken) {
		// 	goto('/login');
		// 	return;
		// }

		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/events/${eventId}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
				credentials: 'include'
			});

			if (!res.ok) throw new Error('Failed to fetch event details');

			const data = await res.json();
			console.log('Backend response data:', data);

			event = data.event;
			user = data.user;
			posterUrl = event!.image || '';
			if (user) {
				isLoggedin.set(true);
			}
		} catch (err: any) {
			error = err.message;
			console.error('Error fetching event details:', err);
		}
	});
</script>

<div
	class="flex min-h-screen w-full max-w-7xl items-center border-x border-black bg-[#222222] max-md:flex-col"
>
	{#if event}
		<div class="flex w-full flex-col items-center p-4 min-md:h-min">
			<EventInfo {event} {posterUrl} />
		</div>

		{#if event.team?.min && event.team.min > 1}
			<GroupRegistrationForm {event} {user} />
		{:else}
			<SoloRegisterButton {event} {user} />
		{/if}
	{:else if error}
		<p class="p-4 text-red-500">{error}</p>
	{:else}
		<p class="p-4 text-white">Loading event and user details...</p>
	{/if}
</div>
