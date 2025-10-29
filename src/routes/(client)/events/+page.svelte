<script lang="ts">
	import { type EventList, type LoadedData } from '$lib/types';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import EventCard from '$lib/components/event-card.svelte';

	let { data }: PageProps = $props();

	let execomList = $state<LoadedData<EventList>>({
		state: 'pending',
		message: 'Loading execom list'
	});

	onMount(async () => {
		try {
			execomList = {
				state: 'success',
				data: await data.eventsRecord
			};
		} catch (error) {
			execomList = {
				state: 'failed',
				message: 'Failed to load'
			};
		}
	});
</script>

<svelte:head>
	<title>Events - CSI TKMCE</title>
</svelte:head>

{#if execomList.state === 'pending'}
	<div class="min-h-screen">Loading</div>
{:else if execomList.state === 'success'}
	<div class="min-h-screen w-full max-w-7xl border-x-1 border-[#181818] bg-[#222222]">
		{#if execomList.data['ongoing'].length > 0}
			<div class="">
				<div class="flex w-full justify-center border-y-1 border-[#181818]">
					<div class="flex h-20 w-full max-w-7xl items-center justify-start">
						<h2 class="flex h-full items-center justify-center bg-black px-10 text-3xl">
							Ongoing Events
						</h2>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2 lg:grid-cols-3">
					{#each execomList.data['ongoing'] as event (event.id)}
						<EventCard {event} />
					{/each}
				</div>
			</div>
		{/if}
		{#if execomList.data['upcoming'].length > 0}
			<div class="flex w-full justify-center border-b-1 border-[#181818]">
				<div class="flex h-20 w-full max-w-7xl items-center justify-start">
					<h2 class="flex h-full items-center justify-center bg-black px-10 text-3xl">
						Upcoming Events
					</h2>
				</div>
			</div>
			<div class="grid grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2 lg:grid-cols-3">
				{#each execomList.data['upcoming'] as event (event.id)}
					<EventCard {event} details={{ status: 'upcoming' }} />
				{/each}
			</div>
		{/if}
		{#if execomList.data['past'].length > 0}
			<div class="">
				<div class="flex w-full justify-center border-y-1 border-[#181818]">
					<div class="flex h-20 w-full max-w-7xl items-center justify-start">
						<h2 class="flex h-full items-center justify-center bg-black px-10 text-3xl">
							Previous Events
						</h2>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2 lg:grid-cols-3">
					{#each execomList.data['past'] as event (event.id)}
						<EventCard {event} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
{:else if execomList.state === 'failed'}
	<div class="min-h-screen">Something went wrong</div>
{/if}
