<script lang="ts">
	import { type ExecomList, type LoadedData } from '$lib/types';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import DummyExecomCard from '$lib/components/dummy-execom-card.svelte';
	import ExecomCard from '$lib/components/execom-card.svelte';

	let { data }: PageProps = $props();

	let execomList = $state<LoadedData<ExecomList>>({
		state: 'pending',
		message: 'Loading execom list'
	});

	onMount(async () => {
		try {
			execomList = {
				state: 'success',
				data: await data.execomList
			};
		} catch (error) {
			execomList = {
				state: 'failed',
				message: 'Failed to load'
			};
		}
	});
</script>

<div class="flex w-full flex-col items-center">
	<div
		class="flex h-40 w-full max-w-7xl items-center justify-center border-x-1 border-b border-[#181818]"
	>
		<h1 class="text-5xl max-sm:text-4xl">MEET OUR TEAM</h1>
	</div>
	{#if execomList.state === 'success'}
		{#each Object.entries(execomList.data) as [section, members]}
			{#if section !== 'Core' && section !== 'Faculty'}
				<div class="flex w-full justify-center border-y-1 border-[#181818]">
					<div
						class="flex h-20 w-full max-w-7xl items-center justify-start border-x-1 border-[#181818]"
					>
						<h2 class="flex h-full items-center justify-center bg-black px-10 text-2xl">
							{section.toLocaleUpperCase()}
						</h2>
					</div>
				</div>
			{/if}
			{#if section !== 'Faculty'}
				<div
					class="mx-auto grid w-full max-w-7xl grid-cols-2 place-items-start justify-center gap-2 border-x-1 border-[#181818] p-5 sm:grid-cols-3 md:grid-cols-4"
				>
					{#each members as member}
						<ExecomCard
							name={member.name}
							pos={member.role}
							socialLink={member.social_link}
							profileImg={member.upload_image}
						/>
					{/each}
				</div>
			{:else}
				<div
					class="mx-auto flex w-full max-w-7xl justify-center gap-2 border-x-1 border-[#181818] p-5"
				>
					{#each members as member}
						<ExecomCard
							name={member.name}
							pos={member.role}
							socialLink={member.social_link}
							profileImg={member.upload_image}
						/>
					{/each}
				</div>
			{/if}
		{/each}
	{:else if execomList.state === 'pending'}
		<DummyExecomCard />
	{:else if execomList.state === 'failed'}
		<div class="min-h-screen">Something went wrong</div>
	{/if}
</div>
