import { PUBLIC_API_URL } from '$env/static/public';

export async function getDepts() {
	const res = await fetch(`${PUBLIC_API_URL}/api/data/getDepts/`, {
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
