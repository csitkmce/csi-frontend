import { PUBLIC_API_URL } from '$env/static/public';
import type { LeaderBoard } from '$lib/types';

export async function getLeaderboard(): Promise<LeaderBoard[]> {
	const res = await fetch(`${PUBLIC_API_URL}/api/leaderboard/`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		console.log(error);
		throw new Error(error.meesage);
	}
	return await res.json();
}	
