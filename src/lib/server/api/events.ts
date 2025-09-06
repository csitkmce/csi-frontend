import type { EventList } from '$lib/types';

export async function getEventsData(fetchFn: typeof fetch): Promise<EventList> {
	const res = await fetchFn('/api/events/', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		console.error("Error fetching events:", error);
		throw new Error(error.message || 'Failed to fetch events');
	}

	return await res.json();
}
