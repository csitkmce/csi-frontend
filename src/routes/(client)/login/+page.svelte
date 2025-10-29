<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { isLoggedin } from '$lib/stores/auth';
	import { validateLogin } from '$lib/utils/validation';
	import type { SubmitFunction } from '@sveltejs/kit';

	let errorText = $state('');
	let errorField = $state('');

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		const form = e?.target as HTMLFormElement;
		const formData = new FormData(form);

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const error = validateLogin(email, password);
		if (error) {
			errorText = error;
			return;
		}

		try {
			const res = await fetch(`/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ email, password })
			});

			const data = await res.json();
			console.log('data: ', data);

			if (res.ok) {
				localStorage.setItem('accessToken', data.accessToken);
				isLoggedin.set(true);
				await invalidateAll();
				await goto('/');
			} else {
				errorText = data.error || 'Login failed';
				errorField = data.errorfield || '';
			}
		} catch (err) {
			errorText = (err as Error).message || 'Login Failed';
			errorField = '';
		}
	};
</script>

<div class="flex min-h-screen w-full flex-col items-center bg-white p-10 text-black">
	<h1 class="text-5xl text-[#222222]">WELCOME BACK</h1>
	<div class="mt-10 min-w-sm border-1 border-black shadow-[4px_4px_0_0_black]">
		<div class="flex w-full justify-between border-b-1 border-black bg-neutral-200">
			<div class="flex items-center justify-center gap-4 p-4">
				<div class="h-3 w-3 rounded-full bg-red-500"></div>
				<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
				<div class="h-3 w-3 rounded-full bg-green-500"></div>
			</div>
			<h3 class="//bg-[#BFBFBF] w-fit bg-neutral-300 p-4 text-neutral-400">Login</h3>
		</div>
		<form onsubmit={handleSubmit}>
			<div class="flex w-full flex-col items-center p-4">
				<div
					class="{errorText
						? 'visible'
						: 'invisible'} mb-4 flex min-h-6 w-full items-center justify-start rounded bg-red-200 px-1"
				>
					<p class="text-sm text-red-500">{errorText}</p>
				</div>
				<div class="grid w-full auto-cols-fr grid-cols-[120px_auto] gap-5">
					<p class="text-md w-fit">Email</p>
					<input
						name="email"
						class="h-8 w-full rounded-xs border-1 border-black p-2 {errorField === 'email'
							? 'border-red-500'
							: ''}"
						type="email"
					/>
					<p class="text-md w-fit">Password</p>
					<input
						name="password"
						class="h-8 w-full rounded-xs border-1 border-black p-2 {errorField === 'password'
							? 'border-red-500'
							: ''}"
						type="password"
					/>
				</div>
				<button
					type="submit"
					class="m-4 mt-8 cursor-pointer border-1 border-black bg-[#D9D9D9] px-6 py-3 ease-in-out hover:bg-black hover:text-white"
				>
					Login
				</button>
				<div class="mt-2 mb-4 flex w-full items-center justify-end">
					<a class="text-sm text-[#008CFF]" href="">Forgot Password?</a>
				</div>
			</div>
		</form>
	</div>
	<div class="mt-4 flex justify-center gap-2 text-sm">
		<p>Don't have an account?</p>
		<a class="text-[#008CFF]" href="/register">Register Here</a>
	</div>
</div>
