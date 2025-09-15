<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Event } from '$lib/types';

	const {
		event,
		details = {
			status: 'past',
			isCertificateAvailable: false
		}
	}: {
		event: Event;
		details?: {
			status: 'upcoming' | 'ongoing' | 'past' | 'myevent';
			isCertificateAvailable?: boolean;
		};
	} = $props();

	function enableRegister() {
		return !(event.isRegistrationFull || !event.regOpen);
	}

	function gotoPage() {
		const link = event.team.max > 1 ? `/events/${event.id}` : `/events/${event.id}`;
		goto(link);
	}
</script>

<div class="z-0 m-2 flex flex-col overflow-hidden bg-white shadow-[4px_4px_0_0_black]">
	<div class="aspect-3/2 w-full overflow-hidden bg-black">
		<img alt="event-poster" src={event.image} />
	</div>
	{#if (!event.regOpen || event.isRegistrationFull) && details.status === 'upcoming'}
		<div class="flex w-full flex-col items-end justify-end gap-x-2">
			{#if event.isRegistrationFull && event.regOpen}
				<div class="marquee-container flex items-center bg-yellow-200 py-1">
					<div class="marquee-track text-xs font-bold text-yellow-800">
						<span>Registration Full | </span>
						<span>Registration Full | </span>
						<span>Registration Full | </span>
						<span>Registration Full | </span>
						<span>Registration Full | </span>
					</div>
				</div>
			{/if}
			{#if !event.regOpen}
				<div class="marquee-container flex items-center bg-red-200 py-1">
					<div class="marquee-track text-xs font-bold text-red-800">
						<span>Registration Closed | </span>
						<span>Registration Closed | </span>
						<span>Registration Closed | </span>
						<span>Registration Closed | </span>
						<span>Registration Closed | </span>
					</div>
				</div>
			{/if}
		</div>
	{/if}
	<div class="flex flex-col items-center p-4">
		<div class="w-full">
			<h3 class="text-lg font-bold text-gray-800">{event.name}</h3>
			<p class="mb-2 text-sm text-gray-400">{event.description}</p>
			<p class="text-sm text-gray-600">{event.venue}</p>
		</div>
		{#if details?.status === 'upcoming'}
			<button
				class="cursor-pointer {enableRegister()
					? 'bg-[#BFBFBF] text-black hover:bg-black hover:text-white'
					: 'bg-gray-200 text-gray-400'} mt-2 p-2 max-sm:ml-2"
				onclick={gotoPage}
				disabled={!enableRegister()}>Register</button
			>
		{:else if details?.status === 'myevent'}
			<div class="flex w-full flex-col items-center justify-center max-sm:flex-col">
				{#if !details.isCertificateAvailable}
					<!-- Before event ends → show team code -->
					<button
						class="mt-2 w-full cursor-pointer bg-[#BFBFBF] p-2 text-black hover:bg-black hover:text-white"
						>Ticket</button
					>
					{#if event.teamCode}
						<button
							class="mt-2 w-full cursor-pointer bg-[#BFBFBF] p-2 text-black hover:bg-black hover:text-white"
						>
							Team Code: {event.teamCode}
						</button>
					{/if}
				{:else}
					<!-- After event ends → show certificate -->
					<button
						class="mt-2 w-full cursor-pointer bg-[#BFBFBF] p-2 text-black hover:bg-black hover:text-white"
					>
						Certificate
					</button>
				{/if}
			</div>
		{/if}
	</div>
	<div class="mt-auto flex w-full items-center justify-between bg-[#BFBFBF] p-2 text-black">
		<p class="font-bold">{event.eventStartDate}</p>
		<p>
			{event.durationDays > 0
				? event.eventEndDate
				: `${event.eventStartTime}-${event.eventEndTime}`}
		</p>
	</div>
</div>
