<script lang="ts">
	import type { Event } from '$lib/types';

	export let event: Event;
	export let posterUrl: string = '';

	function formatDateUTC(dateStr: string | null | undefined) {
	if (!dateStr) return 'TBA';
	const d = new Date(dateStr);
	return isNaN(d.getTime())
		? 'TBA'
		: d.toLocaleDateString('en-GB', { timeZone: 'UTC' });
}

function formatTimeUTC(dateStr: string | null | undefined) {
	if (!dateStr) return '';
	const d = new Date(dateStr);
	return isNaN(d.getTime())
		? ''
		: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
}
</script>

<div
	class="flex w-full max-w-7xl items-center border-black bg-[#222222] max-md:h-full max-md:flex-col min-md:border-r-1"
>
	<div class="flex w-full flex-col items-center p-4 min-md:justify-start">
		{#if posterUrl}
			<img
				src={posterUrl}
				alt="Event poster"
				class="mb-4 border max-sm:w-80 min-sm:max-w-[400px]"
			/>
		{/if}

		<h2 class="mb-2 text-2xl font-bold">{event.name}</h2>
		<p class="mt-2 text-lg text-gray-400 min-sm:text-justify">
			{event.description}
		</p>

		<div class="mt-4 space-y-2 text-white">
			<p>Venue: {event.venue || 'TBA'}</p>
			<p>Fee: {event.fee > 0 ? `₹${event.fee}` : 'Free'}</p>
			<p>Team size: {event.team.min} – {event.team.max}</p>
			<p>
				Event: {formatDateUTC(event.eventStart)} - {formatDateUTC(event.eventEnd)}
			</p>
			<p>{event.food ? 'Food provided' : ''}</p>
   {#if event.whatsapp}
				<a class="text-blue-400 underline" href={event.whatsapp} target="_blank">
					Join WhatsApp Group
				</a>
			{/if}
		</div>
	</div>
</div>
