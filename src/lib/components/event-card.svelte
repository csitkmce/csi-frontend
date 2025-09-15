<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Event } from '$lib/types';
	import QRCode from 'qrcode';
	import html2canvas from 'html2canvas';
	import { CopyIcon } from '@lucide/svelte';

	const {
		event,
		details = {
			name: 'Unknown',
			email: 'Unknown',
			department: 'Unknown',
			batch: 'Unknown',
			graduationYear: 'Unknown',
			status: 'past',
			isCertificateAvailable: false
		}
	}: {
		event: Event;
		details?: {
			name: string;
			email: string;
			department: string;
			batch: string;
			graduationYear: string;
			status: 'upcoming' | 'ongoing' | 'past' | 'myevent';
			isCertificateAvailable?: boolean;
		};
	} = $props();

	let qrVisible = $state(false);
	let detailsVisible = $state(false);
	let qrCodeDataUrl = $state('');
	let ticketRef = $state<HTMLElement | null>(null);
	let copied = $state(false);

	function enableRegister() {
		return !(event.isRegistrationFull || !event.regOpen);
	}

	function gotoPage() {
		const link = event.team.max > 1 ? `/events/${event.id}` : `/events/${event.id}`;
		goto(link);
	}

	async function showTicketQR() {
		const customCode = event.registrationId ?? `null`;

		qrCodeDataUrl = await QRCode.toDataURL(customCode, {
			width: 200,
			margin: 2,
			color: { dark: '#000000', light: '#ffffff' }
		});

		qrVisible = true;
	}

	function showDetails() {
		detailsVisible = true;
	}

	async function downloadTicket() {
		if (!ticketRef) return;
		const canvas = await html2canvas(ticketRef);
		const dataUrl = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = `${event.name}-ticket.png`;
		link.click();
	}

	async function copyTeamCode() {
		if (event.teamCode) {
			await navigator.clipboard.writeText(event.teamCode);
			copied = false; // reset to re-trigger animation
			requestAnimationFrame(() => {
				copied = true;
			});
			setTimeout(() => (copied = false), 2000); // remove after animation ends
		}
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
			{#if details.status !== 'myevent'}
				<p class="mb-2 text-sm text-gray-400">{event.description}</p>
			{/if}
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
			<div class="flex w-full flex-col items-center justify-center text-black max-sm:flex-col">
				{#if !details.isCertificateAvailable}
					<!-- Before event ends → show team code -->
					{#if event.teamCode}
						<p class="mt-2 w-full">Team Name: <span class="font-bold">{event.teamName}</span></p>
						<button
							onclick={copyTeamCode}
							class="pointer-cursor flex w-full cursor-pointer items-center justify-between justify-start gap-x-3 py-2 text-black"
						>
							<p>
								Team Code:
								<span class="font-bold {copied ? 'animate-copy' : ''}">{event.teamCode}</span>
							</p>
							<CopyIcon size="20" />
						</button>
						<button
							onclick={showDetails}
							class="mt-2 w-full cursor-pointer bg-[#BFBFBF] p-2 text-black hover:bg-black hover:text-white"
							>View Details</button
						>
					{/if}
					<button
						onclick={showTicketQR}
						class="mt-2 w-full cursor-pointer bg-[#BFBFBF] p-2 text-black hover:bg-black hover:text-white"
						>Ticket</button
					>
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

<!-- Ticket popup -->
{#if qrVisible}
	<div class="absolute inset-0 z-30 flex items-center justify-center bg-[#00000080]">
		<div class="flex flex-col bg-white">
			<div
				class="flex max-h-150 min-w-80 flex-col rounded bg-white px-5 py-10 text-black"
				bind:this={ticketRef}
			>
				<h2 class="mb-10 w-full text-center text-2xl font-bold uppercase">{event.name}</h2>
				<p class="text-lg">Date: <span class="font-bold">{event.eventStartDate}</span></p>
				<p>Venue: <span class="font-bold">{event.venue}</span></p>
				<p>Name: <span class="font-bold">{details.name}</span></p>
				<p>Email: <span class="font-bold">{details.email}</span></p>
				<p>Department: <span class="font-bold">{details.department}</span></p>
				<p>Batch: <span class="font-bold">{details.batch}</span></p>
				<p>Batch Year: <span class="font-bold">{details.graduationYear}</span></p>
				{#if event.teamCode}
					<p class="my-10 w-full text-center font-bold uppercase">
						Team Code: <span class="font-bold {copied ? 'animate-copy' : ''}">{event.teamCode}</span
						>
					</p>
				{/if}
				{#if qrCodeDataUrl}
					<div class="flex w-full justify-center">
						<img class="max-w-60" src={qrCodeDataUrl} alt="QR Code" />
					</div>
				{/if}
			</div>
			<div class="flex gap-x-2 px-2 py-2">
				<button
					onclick={downloadTicket}
					class="w-full cursor-pointer bg-[#BFBFBF] p-2 text-black hover:bg-black hover:text-white"
				>
					Download
				</button>
				<button
					onclick={() => (qrVisible = false)}
					class="w-full cursor-pointer bg-[#BFBFBF] p-2 text-black hover:bg-black hover:text-white"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

{#if detailsVisible}
	<div class="absolute inset-0 z-30 flex items-center justify-center bg-[#00000080]">
		<div class="flex flex-col bg-white">
			<div class="flex max-h-150 min-w-80 flex-col rounded bg-white px-5 py-10 text-black">
				<p class="text-lg font-bold">Team Leader:</p>
				<p>{event.teamLead?.name}</p>
				<p class="mt-5 text-lg font-bold">Team Members:</p>
				<ol class="ml-8 list-decimal">
					{#each event.teamMembers! as member}
						<li>{member.name}</li>
					{/each}
				</ol>
			</div>
			<div class="flex gap-x-2 px-2 py-2">
				<button
					onclick={() => (detailsVisible = false)}
					class="w-full cursor-pointer bg-[#BFBFBF] p-2 text-black hover:bg-black hover:text-white"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
