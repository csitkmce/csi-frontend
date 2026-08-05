<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	// RAZORPAY (commented out)
	// import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { isLoggedin } from '$lib/stores/auth';
	import EventInfo from '$lib/components/event-EventInfo.svelte';
	import GroupRegistrationForm from '$lib/components/event-GroupRegistrationForm.svelte';
	import SoloRegisterButton from '$lib/components/event-SoloRegisterButton.svelte';
	import type { Event, User } from '$lib/types';
	// RAZORPAY (commented out - replaced by QR code + WhatsApp flow)
	// import { PUBLIC_RAZORPAY_KEY_ID } from '$env/static/public';

	// Static payment QR image shown in the popup.
	// Put your QR image at: csi-frontend/static/images/payment-qr.png
	const PAYMENT_QR_URL = '/images/payment-qr.jpegdid ju ';

	let posterUrl = '';
	let error = '';
	let event: Event | null = null;
	let user: User | null = null;
	let accessToken: string | null = null;
	let paymentError = '';
	let paymentSuccess = '';
	let showPaymentModal = $state(false);

	// RAZORPAY (commented out)
	// const RAZORPAY_KEY_ID = PUBLIC_RAZORPAY_KEY_ID;

	// type PaymentOrderData = {
	// 	success: boolean;
	// 	message: string;
	// 	data: {
	// 		orderId: string;
	// 		amount: number;
	// 		currency: string;
	// 		eventName: string;
	// 		userName: string;
	// 		userEmail: string;
	// 	};
	// };

	onMount(async () => {
		const eventId = $page.params.event_id;
		accessToken = localStorage.getItem('accessToken');

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
		paymentError = '';
		paymentSuccess = '';
		showPaymentModal = true;

		// RAZORPAY (commented out - original Razorpay payment flow)
		// try {
		// 	const res = await fetch(`${PUBLIC_API_URL}/api/payments/initiate/`, {
		// 		method: 'POST',
		// 		headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
		// 		body: JSON.stringify({ registrationId })
		// 	});
		//
		// 	const orderData: PaymentOrderData = await res.json();
		//
		// 	if (!res.ok) {
		// 		paymentError = orderData?.message || 'Could not initiate payment';
		// 		return;
		// 	}
		//
		// 	const options = {
		// 		key: RAZORPAY_KEY_ID,
		// 		amount: Math.round(orderData.data.amount * 100),
		// 		currency: orderData.data.currency,
		// 		name: 'CSI Registration Payment',
		// 		description: 'Payment for event registration',
		// 		order_id: orderData.data.orderId,
		// 		handler: async function (response: any) {
		// 			try {
		// 				const verifyRes = await fetch(`${PUBLIC_API_URL}/api/payments/verify/`, {
		// 					method: 'POST',
		// 					headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
		// 					body: JSON.stringify(response)
		// 				});
		// 				const verifyData = await verifyRes.json();
		//
		// 				if (verifyRes.ok) {
		// 					paymentSuccess = 'Payment successful! Redirecting to your events...';
		// 					setTimeout(() => goto('/'), 1500);
		// 				} else {
		// 					paymentError = verifyData?.message || 'Payment verification failed';
		// 				}
		// 			} catch (verifyErr: any) {
		// 				paymentError = verifyErr?.message || 'Payment verification failed';
		// 			}
		// 		},
		// 		prefill: {
		// 			name: orderData.data.userName,
		// 			email: orderData.data.userEmail
		// 		},
		// 		theme: {
		// 			color: '#008CFF'
		// 		}
		// 	};
		//
		// 	const rzp = new (window as any).Razorpay(options);
		// 	rzp.open();
		// } catch (err: any) {
		// 	paymentError = err.message;
		// 	console.error('Error on payment: ', err);
		// }
	}

	function closePaymentModal() {
		showPaymentModal = false;
	}
</script>

<!-- RAZORPAY (commented out - Razorpay checkout script)
<svelte:head>
	<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</svelte:head>
-->

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

		{#if paymentError}
			<p class="w-full p-4 text-center text-red-500">{paymentError}</p>
		{/if}
		{#if paymentSuccess}
			<p class="w-full p-4 text-center text-green-500">{paymentSuccess}</p>
		{/if}
	{:else if error}
		<p class="p-4 text-red-500">{error}</p>
	{:else}
		<p class="p-4 text-white">Loading event and user details...</p>
	{/if}
</div>

{#if showPaymentModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
		<div class="flex flex-col items-center rounded-lg bg-white p-6 text-black">
			<h2 class="mb-1 w-full text-center text-xl font-bold uppercase">Pay via QR</h2>
			<p class="mb-4 text-center text-sm text-[#606060]">
				Scan the QR code below to complete your payment for {event?.name}
			</p>

			<img class="max-w-65" src={PAYMENT_QR_URL} alt="Payment QR Code" />

			{#if event?.whatsapp}
				<a
					class="mt-4 w-full cursor-pointer border-1 border-black bg-[#25D366] px-6 py-3 text-center font-bold text-white ease-in-out hover:bg-[#1da851]"
					href={event.whatsapp}
					target="_blank"
					rel="noopener noreferrer"
				>
					Join WhatsApp Group
				</a>
			{/if}

			<button
				onclick={closePaymentModal}
				class="mt-3 w-full cursor-pointer border-1 border-black bg-[#BFBFBF] px-6 py-3 text-center text-black ease-in-out hover:bg-[#222222] hover:text-white"
			>
				Close
			</button>
		</div>
	</div>
{/if}
