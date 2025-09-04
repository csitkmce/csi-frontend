import { PUBLIC_API_URL } from '$env/static/public';

export async function registerUser(
	name: string,
	email: string,
	department: string,
	batch: string,
	year: string,
	phone_number: string,
	password: string
) {
	const res = await fetch(`${PUBLIC_API_URL}/api/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, email, department, batch, year, phone_number, password })
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		console.log(error);
		throw new Error(error.meesage);
	}
	return await res.json();
}

export async function loginUser(email: string, password: string) {
	const res = await fetch(`${PUBLIC_API_URL}/api/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		console.log(error);
		throw new Error(error.meesage);
	}
	return await res.json();
}
