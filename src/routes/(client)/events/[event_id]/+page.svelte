<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_API_URL, PUBLIC_RAZORPAY_KEY_ID } from '$env/static/public';
	import { isLoggedin } from '$lib/stores/auth';
	import EventInfo from '$lib/components/event-EventInfo.svelte';
	import GroupRegistrationForm from '$lib/components/event-GroupRegistrationForm.svelte';
	import SoloRegisterButton from '$lib/components/event-SoloRegisterButton.svelte';
	import type { Event, User } from '$lib/types';

	let posterUrl = '';
	let error = '';
	let event: Event | null = null;
	let user: User | null = null;
	let accessToken: string | null = null;

	const RAZORPAY_KEY_ID = PUBLIC_RAZORPAY_KEY_ID;

	type PaymentOrderType = {
		success: boolean;
		message: string;
		data: {
			orderId: string;
			amount: number;
			currency: string;
			eventName: string;
			userName: string;
			userEmail: string;
		};
	};

	onMount(async () => {
		const eventId = $page.params.event_id;
		accessToken = localStorage.getItem('accessToken');

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

	async function paymentFunc(registrationId: string) {
		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/payments/initiate/`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({ registrationId })
			});
			const orderData: Promise<PaymentOrderType> = await res.json();

			const options = {
				key: RAZORPAY_KEY_ID,
				amount: 4000,
				currency: (await orderData).data.currency,
				name: 'CSI Registration Payment',
				description: 'Payment for event registration',
				order_id: (await orderData).data.orderId,
				handler: async function (response: any) {
					alert('Payment Successful');
					console.log(response);
					const res = await fetch(`${PUBLIC_API_URL}/api/payments/verify/`, {
						method: 'POST',
						headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
						body: JSON.stringify({ response })
					});
					const newRes = await res.json();
					console.log(newRes);
				},
				prefill: {
					name: (await orderData).data.userName,
					email: (await orderData).data.userEmail
				},
				theme: {
					color: '#008CFF'
				}
			};

			const rzp = new (window as any).Razorpay(options);
			rzp.open();
		} catch (err: any) {
			error = err.message;
			console.error('Error on payment: ', err);
		}
	}
</script>

<svelte:head>
	<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</svelte:head>

<div
	class="flex min-h-screen w-full max-w-7xl items-center border-x border-black bg-[#222222] max-md:flex-col"
>
	{#if event}
		<div class="flex w-full flex-col items-center p-4 min-md:h-min">
			<EventInfo {event} {posterUrl} />
		</div>

		{#if event.team?.min && event.team.min > 1}
			<GroupRegistrationForm {event} {user} {paymentFunc} />
		{:else}
			<SoloRegisterButton {event} {user} {paymentFunc} />
		{/if}
	{:else if error}
		<p class="p-4 text-red-500">{error}</p>
	{:else}
		<p class="p-4 text-white">Loading event and user details...</p>
	{/if}
</div>
