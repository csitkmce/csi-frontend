<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { isLoggedin } from '$lib/stores/auth';
	import type { User, Event } from '$lib/types';

	let details: {
		event?: Event;
		user?: User;
	} = $state({});

	$effect(() => {
		async function fetchData() {
			const searchParams = $page.url.searchParams;
			const id = searchParams.get('id');

			const accessToken = localStorage.getItem('accessToken');

			if (!accessToken) {
				await invalidateAll();
				await goto('/login');
			}

			try {
				const res = await fetch(`${PUBLIC_API_URL}/api/events/${id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`
					},
					credentials: 'include'
				});

				if (res.status === 401) {
					const resRefresh = await fetch(`${PUBLIC_API_URL}/api/refresh/`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						},
						credentials: 'include'
					});

					if (resRefresh.status === 401) {
						localStorage.removeItem('accessToken');
						isLoggedin.set(false);
						goto('/login');
					} else if (resRefresh.status === 200) {
						const { accessToken: newToken } = await resRefresh.json();
						localStorage.setItem('accessToken', newToken);
						isLoggedin.set(true);
						details = await resRefresh.json();
					} else {
						throw new Error('Refresh request failed');
					}
				} else if (res.status === 200) {
					isLoggedin.set(true);
					details = await res.json();
				} else {
					throw new Error('User request failed');
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				localStorage.removeItem('accessToken');
				isLoggedin.set(false);
				goto('/login');
			}
		}
		fetchData();
	});
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
