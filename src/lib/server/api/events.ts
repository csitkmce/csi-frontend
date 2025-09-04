import { PUBLIC_API_URL } from '$env/static/public';
import type { EventList } from '$lib/types';

export async function getEventsData(): Promise<EventList> {
	const res = await fetch(`/api/events/`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		console.log(error);
		throw new Error(error.message);
	}

	return await res.json();
}
