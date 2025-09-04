import { PUBLIC_API_URL } from '$env/static/public';
import type { ExecomList } from '$lib/types';

export async function getExecomData(year: number): Promise<ExecomList> {
	const res = await fetch(`${PUBLIC_API_URL}/api/execom/${year}`, {
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
