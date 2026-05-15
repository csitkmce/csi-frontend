import { PUBLIC_API_URL } from '$env/static/public';
import type { UserRaw } from '$lib/types';

export async function getUser(): Promise<UserRaw> {
	const res = await fetch(`${PUBLIC_API_URL}/api/user/`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});

	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		console.error('Error fetching events:', data);
		throw new Error(data.message || 'Failed to fetch events');
	}

	if (data.requiresLogin) {
		throw new Error('REQUIRE_LOGIN');
	}

	return await res.json();
}
