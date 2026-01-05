<script lang="ts">
	import LocalhostEventCard from '$lib/components/localhost/localhost-event-card.svelte';
	import type { EventList, LHeventList, LoadedData } from '$lib/types';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import DateBox from '$lib/components/localhost/date-box.svelte';

	let { data }: PageProps = $props();

	let eventList = $state<LoadedData<LHeventList>>({
		state: 'pending',
		message: 'Loading event list'
	});

	onMount(async () => {
		try {
			eventList = {
				state: 'success',
				data: await data.lhEventsRecord
			};
		} catch (error) {
			eventList = {
				state: 'failed',
				message: 'Failed to load'
			};
		}
	});
</script>

<div class="flex h-full w-full flex-col items-center overflow-x-hidden">
	<section>
		<div class="relative flex h-screen w-full flex-col items-center justify-center">
			<div class="flex flex-col">
				<div class="marquee-container flex items-center p-5">
					<div class="text-outline marquee-track flex gap-x-20 font-akira text-[60px] uppercase">
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
					</div>
				</div>
				<div class="marquee-container flex items-center p-5">
					<div class="text-outline marquee-track flex gap-x-20 font-akira text-[60px] uppercase">
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
					</div>
				</div>
				<div class="marquee-container flex items-center p-5">
					<div class="text-outline marquee-track flex gap-x-20 font-akira text-[60px] uppercase">
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
					</div>
				</div>
				<div class="marquee-container flex items-center p-5">
					<div class="text-outline marquee-track flex gap-x-20 font-akira text-[60px] uppercase">
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
					</div>
				</div>
				<div class="marquee-container flex items-center p-5">
					<div class="text-outline marquee-track flex gap-x-20 font-akira text-[60px] uppercase">
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
					</div>
				</div>
				<div class="marquee-container flex items-center p-5">
					<div class="text-outline marquee-track flex gap-x-20 font-akira text-[60px] uppercase">
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
						<span>LOCALHOST</span>
					</div>
				</div>
			</div>
			<div class="absolute my-auto flex flex-col items-center">
				<img class="w-150 max-sm:w-100" alt="LocalHost 26" src="localhost/LOCALHOST26.png" />
				<div class="mt-10 flex flex-col items-center font-akira text-2xl uppercase">
					<p>February</p>
					<p class="text-[#479DFF]">20 - 23</p>
				</div>
			</div>
		</div>
	</section>
	<section class="relative flex flex-col items-center justify-center font-akira">
		<img
			class="absolute z-20 mx-auto my-auto w-40"
			alt="LH-scribble"
			src="localhost/LH-scribble.png"
		/>
		<div class="mt-10 mb-20 h-fit max-w-6xl p-5">
			<p class="text-justify text-sm text-[#BABABA] uppercase">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
				voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
				cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
			</p>
			<div class="mt-5 flex flex-col items-end">
				<p class="text-xs">CSI TKMCE TEAM</p>
				<img class="w-16" alt="scribble" src="localhost/scribble1.png" />
			</div>
		</div>
	</section>
	{#if eventList.state === 'success'}
		<section class="max-w-6xl px-5">
			<h2 class="font-akira text-2xl uppercase">Events</h2>
			<div class="flex">
				<div class="flex w-20 justify-center max-sm:hidden">
					<div class=" h-full border-l-2 border-dashed border-[#888888]"></div>
				</div>
				<div class="flex flex-col">
					{#each Object.entries(eventList.data) as [key, events]}
						<DateBox raw_date={key} />
						{#each events as event}
							<LocalhostEventCard
								title={event.event_name}
								img={event.image}
								desc={event.description}
								time={event.start_time}
								coordinators={['Farhaan - 8080808080', 'Farhaan - 8080808080']}
								venue={event.venue}
								regStatus="closed"
							/>
						{/each}
					{/each}
				</div>
			</div>
		</section>
	{:else if eventList.state === 'pending'}
		<p>Loading Data</p>
	{:else}
		<p>Failed to Load</p>
	{/if}
</div>
