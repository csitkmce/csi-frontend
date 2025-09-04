export function validateRegistration(name: unknown, email: unknown, department: unknown, batch: unknown, year: unknown, phone_number: unknown, password: unknown, confirm_password: unknown) {
	if (typeof name !== 'string' || typeof email !== 'string' || typeof department !== 'string' || typeof batch !== 'string' || typeof year !== 'string' || typeof phone_number !== 'string' || typeof password !== 'string' || typeof confirm_password !== 'string') {
		return 'Invalid form data';
	}
	if (!name || !email || !department || !batch || !year || !phone_number || !password || !confirm_password) {
		return 'All fields are required';
	}

	//check more conditions
	return null;
}

export function validateLogin(email: unknown, password: unknown) {
	if (typeof email !== 'string' || typeof password !== 'string') {
		return 'Invalid form data';
	}
	if (!email || !password) {
		return 'Please provide your email and password';
	}
	return null;
}