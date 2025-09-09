<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { isLoggedin } from '$lib/stores/auth';
	import type { User, Event } from '$lib/types';

	let details: { event?: Event; user?: User } = $state({});
	let error = "";
	let success = "";
	let loading = false;

	// fetch event + user
	$effect(() => {
		async function fetchData() {
			const searchParams = $page.url.searchParams;
			const id = searchParams.get('id');
			const accessToken = localStorage.getItem('accessToken');

			if (!accessToken) {
				localStorage.removeItem('accessToken');
				isLoggedin.set(false);
				await goto('/login');
				return;
			}

			try {
				const res = await fetch(`${PUBLIC_API_URL}/api/events/${id}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
					credentials: 'include'
				});

				if (res.ok) {
					isLoggedin.set(true);
					details = await res.json();
				} else {
					throw new Error('Failed to fetch event details');
				}
			} catch (err) {
				console.error('Auth check failed:', err);
				localStorage.removeItem('accessToken');
				isLoggedin.set(false);
				details = {};
				await goto('/login');
			}
		}
		fetchData();
	});

	// register for event (solo only)
	async function register() {
		error = "";
		success = "";
		loading = true;

		const accessToken = localStorage.getItem('accessToken');
		const id = $page.url.searchParams.get('id');

		if (!accessToken) {
			error = "You must be logged in.";
			loading = false;
			return;
		}

		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify({ eventId: id }) // ✅ only eventId for solo event
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.message || "Registration failed";
				return;
			}

			success = "Successfully registered!";
			console.log("Registration success:", data);
			goto("/"); // redirect home or success page
		} catch (err) {
			console.error(err);
			error = "Something went wrong.";
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex w-full flex-col items-start justify-start gap-y-2 p-4">
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Event Name:</h3>
		<p class="text-lg">{details.event?.name}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Name:</h3>
		<p class="text-lg">{details.user?.name}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Email:</h3>
		<p class="text-lg">{details.user?.email}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Department:</h3>
		<p class="text-lg">{details.user?.department}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Batch:</h3>
		<p class="text-lg">{details.user?.batch}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Graduation Year:</h3>
		<p class="text-lg">{details.user?.year}</p>
	</div>
	<div class="flex w-full items-center justify-center">
		<button
			class="m-4 cursor-pointer border-1 border-black bg-[#ffffff] px-6 py-3 text-black ease-in-out hover:bg-black hover:text-white"
		>
			Register
		</button>
	</div>
</div>
