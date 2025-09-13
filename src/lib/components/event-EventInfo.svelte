<script lang="ts">
	export let event: any;
	export let posterUrl: string = '';
</script>

<div
	class="flex min-h-screen w-full max-w-7xl items-center border-x-1 border-black bg-[#222222] max-md:flex-col"
>
	<div class="flex w-full flex-col items-center p-4">
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

		<div class="mt-4 space-y-1 text-white">
			<p>Venue: {event.venue || 'TBA'}</p>
			<p>Fee: {event.fee > 0 ? `₹${event.fee}` : 'Free'}</p>
			<!-- <p>Team size: {event.team.min} – {event.team.max}</p> -->
			<p>
				Registration: {new Date(event.regStart).toLocaleString()} – {new Date(
					event.regEnd
				).toLocaleString()}
			</p>
			{#if event.whatsappLink}
				<a class="text-blue-400 underline" href={event.whatsappLink} target="_blank">
					Join WhatsApp Group
				</a>
			{/if}
			<p>{event.food ? '🍴 Food provided' : 'No food'}</p>
		</div>
	</div>
</div>
