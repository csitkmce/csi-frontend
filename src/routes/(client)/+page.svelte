<script lang="ts">
	import { onMount } from 'svelte';
	import EventCard from '$lib/components/event-card.svelte';
	import {
		type Event,
		type EventData,
		type ExecomApplicationData,
		type LoadedData
	} from '$lib/types';
	import { MessageCircle, Power } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { isLoggedin } from '$lib/stores/auth.js';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ExecomCallCard from '$lib/components/execom-call/execom-call-card.svelte';
	import { EXECOM_CALL_ACTIVE } from '$lib/constants.js';

	let { data } = $props();
	let isLightOn: boolean = $state(false);

	function toggleLight(): void {
		isLightOn = !isLightOn;
	}

	let myEvents = $state<LoadedData<EventData>>({
		state: 'pending',
		message: 'Loading events list'
	});

	let execomApplicationData = $state<LoadedData<ExecomApplicationData>>({
		state: 'pending',
		message: 'Loading Application data'
	});

	$effect(() => {
		async function loadEvents() {
			if ($isLoggedin) {
				const accessToken: string = localStorage.getItem('accessToken')!;
				try {
					const res = await fetch(`${PUBLIC_API_URL}/api/`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${accessToken}`
						}
					});
					if (!res.ok) {
						const error = await res.json().catch(() => ({}));
						console.log(error);
						throw new Error(error.message);
					}
					myEvents = {
						state: 'success',
						data: (await res.json()) as unknown as EventData
					};
				} catch (error) {
					myEvents = {
						state: 'failed',
						message: 'Failed to load'
					};
				}
				if (EXECOM_CALL_ACTIVE) {
					try {
						const res = await fetch(`${PUBLIC_API_URL}/api/execom/application`, {
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${accessToken}`
							}
						});
						if (!res.ok) {
							if (res.status === 404) {
								execomApplicationData = {
									state: 'failed',
									message: '404'
								};
							}
							return;
						}
						const data = await res.json();
						execomApplicationData = {
							state: 'success',
							data: data
						};
					} catch (error) {
						console.error(error);
						execomApplicationData = {
							state: 'failed',
							message: 'Failed to fetch application data'
						};
					}
				}
			} else {
				myEvents = {
					state: 'pending',
					message: 'Loading events list'
				};
			}
		}

		loadEvents();
	});
</script>

<svelte:head>
	<title>CSI - Computer Society of India</title>
</svelte:head>

<div
	class="flex min-h-screen w-full max-w-7xl flex-col justify-start overflow-hidden bg-[#222222] text-white"
>
	{#if (EXECOM_CALL_ACTIVE && execomApplicationData.state === 'failed') || !$isLoggedin}
		<ExecomCallCard
			onRegisterClick={() => {
				if (!$isLoggedin) {
					goto('/login');
				} else {
					goto('/execom-call');
				}
			}}
		/>
	{/if}
	<!-- First Section -->
	<section
		id="hero"
		class="relative flex {$isLoggedin
			? ''
			: 'min-h-180'} flex-col items-center justify-start border-x-1 border-[#181818]"
	>
		{#if !$isLoggedin}
			<div class="flex w-full items-center justify-between border-b-1 border-[#181818]">
				<div class={isLightOn ? 'animate-pulse' : ''}>
					<svg
						width="111"
						height="130"
						viewBox="0 0 111 130"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0.5 128.221L0.5 1.7793L110.001 65L0.5 128.221Z"
							fill={isLightOn ? '#bfbfbf' : '#313131'}
							stroke="[#181818]"
						/>
					</svg>
				</div>
				<button
					class="flex h-[130px] w-[130px] items-center justify-center rounded-full border-1 border-[#181818] bg-[#1B1B1B]"
					onclick={toggleLight}
				>
					<Power color={isLightOn ? '#008CFF' : '#ffffff'} />
				</button>
			</div>
			<div class="flex h-full w-full items-center min-md:px-10">
				<div
					class="lg:rounded-6xl flex items-center overflow-hidden rounded-4xl bg-[#2D2D2D] max-md:m-10 max-md:flex-col"
				>
					<h1 class="mt-8 hidden w-full text-center text-3xl max-md:block">WELCOME TO CSI</h1>
					<div class="flex h-full w-full flex-col items-center justify-center min-xl:max-w-110">
						<img src="/images/csi-home-illus.png" class="w-100" alt="" />
					</div>
					<div class="w-full p-8 max-md:pt-0">
						<h1 class="block text-3xl max-md:hidden">WELCOME TO CSI</h1>
						<p class="mt-4 text-justify font-sans text-sm">
							The Computer Society of India (CSI) - TKMCE Chapter is a vibrant community of tech
							enthusiasts, developers, and innovators at TKM College of Engineering. As a proud
							extension of India’s premier body of IT professionals, we aim to nurture talent,
							foster creativity, and provide a platform for students to explore and excel in the
							world of technology.
						</p>
						<button
							onclick={() => {
								goto('/login');
							}}
							class="mt-10 cursor-pointer rounded-lg bg-[#008CFF] px-4 py-3 text-sm"
							>Ready to join CSI?</button
						>
					</div>
				</div>
			</div>
		{/if}
	</section>

	<!-- About Section -->
	{#if !$isLoggedin}
		<section
			id="about"
			class="relative flex min-h-180 flex-col items-center border-1 border-[#181818] bg-[#222222]"
		>
			<div class="grid w-full grid-cols-3 border-y-1 border-[#181818] bg-[#1B1B1B]">
				<div class="col-span-1 w-full bg-[#2D2D2D] px-10 py-4 text-3xl">WHO ARE WE?</div>
				<div class="col-span-2 w-full"></div>
				<div class="col-span-1 w-full"></div>
				<div class="col-span-2 w-full bg-[#2D2D2D] px-10 py-4 text-4xl">
					<p class="text-justify font-sans text-sm">
						At CSI TKMCE, we’re not just coders we’re creators, dreamers, and doers. Our community
						thrives on curiosity, teamwork, and innovation. We believe technology is more than just
						code; it’s about solving problems, sparking creativity, and building connections. From
						fun events and workshops to competitions and projects, CSI gives every student a chance
						to learn, grow, and shine together.
					</p>
				</div>
			</div>
			<div class="marquee-container my-4 flex items-center border-y-1 border-[#181818] p-5">
				<div class="{isLightOn ? 'marquee-track' : ''} text-4xl font-bold text-[#2D2D2D]">
					<span>WHAT DO WE DO?</span>
					<span>WHAT DO WE DO?</span>
					<span>WHAT DO WE DO?</span>
					<span>WHAT DO WE DO?</span>
					<span>WHAT DO WE DO?</span>
					<span>WHAT DO WE DO?</span>
					<span>WHAT DO WE DO?</span>
					<span>WHAT DO WE DO?</span>
					<span>WHAT DO WE DO?</span>
					<span>WHAT DO WE DO?</span>
				</div>
			</div>
			<div class="flex h-full w-full items-center justify-center p-5 max-md:flex-col-reverse">
				<div class="my-4 flex w-full">
					<p class="mx-2 w-full text-justify font-sans text-sm">
						At CSI TKMCE, we organize events, workshops, and hackathons that bring out the best in
						students. We create opportunities to learn the latest technologies, build projects, and
						share ideas with peers. Our activities range from coding challenges to design sprints,
						from tech talks to creative competitions. Every initiative is aimed at helping students
						grow, collaborate, and gain the confidence to lead in the digital era.
					</p>
				</div>
				<div class="flex flex-col items-center">
					<div
						class="/rounded-full /bg-white mx-10 flex w-full max-w-110 items-center justify-center overflow-hidden max-md:max-w-100 min-md:max-w-100"
					>
						<img class="w-90" alt="" src="/images/csi-whatwedo-illus.png" />
					</div>
				</div>
			</div>
		</section>

		<!-- Join Section -->
		<section
			id="join"
			class="relative flex items-center justify-center border-x-1 border-[#181818] bg-[#22222] py-20"
		>
			<div class="relative z-10 text-center">
				<h2 class="mb-12 text-3xl font-light tracking-wider max-md:w-80">
					SO ARE YOU READY TO JOIN CSI?
				</h2>
				<button
					onclick={() => {
						goto('/login');
					}}
					class="mt-10 cursor-pointer rounded-full bg-[#008CFF] px-10 py-5">YES I AM!</button
				>
			</div>
		</section>
	{/if}
	{#if $isLoggedin}
		<section id="myevents" class="flex flex-col gap-4 border-x border-[#181818] p-4">
			{#if myEvents.state === 'success'}
				<h3 class="w-full text-xl text-[#909090]">
					Hi,<span class="font-bold">{myEvents.data.name.split(' ')[0]}</span>
				</h3>
			{/if}
			{#if execomApplicationData.state === 'success'}
				<div
					class="flex flex-col border-2 border-neutral-700 font-sans shadow-[4px_4px_0_0_[#ffffff]]"
				>
					<h2 class="w-full bg-neutral-900 p-2 text-sm uppercase">My Execom Application</h2>
					<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
						<div class="flex flex-col">
							<p class="text-xs text-neutral-400">Preference 1</p>
							<p class="text-sm font-bold text-neutral-200">
								{execomApplicationData.data.application.preference1}
							</p>
						</div>
						<div class="flex flex-col">
							<p class="text-xs text-neutral-400">Preference 2</p>
							<p class="text-sm font-bold text-neutral-200">
								{execomApplicationData.data.application.preference2}
							</p>
						</div>
						<div class="flex flex-col">
							<p class="text-xs text-neutral-400">Preference 3</p>
							<p class="text-sm font-bold text-neutral-200">
								{#if execomApplicationData.data.application.preference3}
									{execomApplicationData.data.application.preference3}
								{:else}
									Not Applicable
								{/if}
							</p>
						</div>
					</div>
					<div
						class="flex w-full items-center gap-2 border-t-2 border-neutral-700 p-2 max-lg:flex-col lg:justify-between"
					>
						<p class="text-justify text-neutral-400">
							Click the given link to join the whatsapp group for further proceedings. All
							registered applicants must join the group without any delay
						</p>
						<a
							target="_blank"
							class="flex w-full items-center justify-center gap-x-2 bg-green-900 p-2 text-green-300 lg:w-fit"
							href={execomApplicationData.data.whatsappLink}
							>WhatsApp Link <MessageCircle size="15" /></a
						>
					</div>
				</div>
			{/if}
			{#if myEvents.state === 'pending'}
				<div class="flex w-full animate-pulse flex-col items-center overflow-hidden">
					<div class="mb-4 flex h-10 w-full overflow-hidden bg-[#303030]"></div>
					<div class="mb-4 flex h-600 w-full overflow-hidden bg-[#303030]"></div>
				</div>
			{:else if myEvents.state === 'success'}
				{#if myEvents.data.membershipStatus}
					<div
						class="flex flex-col gap-y-2 border-2 border-neutral-700 p-4 font-sans shadow-[4px_4px_0_0_[#181818]]"
					>
						<div class="flex items-center gap-x-2">
							<p class="text-sm">CSI Membership status:</p>
							{#if myEvents.data.membershipStatus === 'active'}
								<div class="rounded bg-green-900 px-2 py-1 text-green-300">Active</div>
							{:else if myEvents.data.membershipStatus === 'expired'}
								<div class="rounded bg-red-900 px-2 py-1 text-red-300">Expired</div>
							{:else}
								<div class="rounded bg-yellow-900 px-2 py-1 text-yellow-300">In Review</div>
							{/if}
						</div>
						{#if myEvents.data.membershipStatus === 'active'}
							<p class="text-neutral-400">
								Expires on: <span class="font-bold">23-09-{myEvents.data.membershipExp}</span>
							</p>
						{/if}
					</div>
				{/if}
				<div class="flex flex-col border-2 border-neutral-700 p-4 shadow-[4px_4px_0_0_[#181818]]">
					<h2 class="w-full text-2xl">My Events</h2>
					{#if myEvents.data.events.length === 0}
						<div class="flex h-100 w-full flex-col items-center justify-center">
							<div
								class="/rounded-full /bg-white mx-10 flex w-full max-w-110 items-center justify-center overflow-hidden max-md:max-w-100 min-md:max-w-100"
							>
								<img class="w-90" alt="" src="/images/no-events.png" />
							</div>
							<p class="text-lg text-[#808080]">No registered events</p>
						</div>
					{:else}
						<div class="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
							{#each myEvents.data.events as event}
								<EventCard
									{event}
									details={{
										status: 'myevent',
										name: myEvents.data.name,
										email: myEvents.data.email,
										department: myEvents.data.department,
										batch: myEvents.data.batch,
										graduationYear: myEvents.data.graduationYear
									}}
								/>
							{/each}
						</div>
					{/if}
				</div>
			{:else if myEvents.state === 'failed'}
				Someting went wrong. Please reload the page
			{/if}
		</section>
	{/if}
</div>
