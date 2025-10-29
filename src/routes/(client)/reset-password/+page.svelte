<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { LoadedData, resetUserData } from '$lib/types';
	import { validateReset } from '$lib/utils/validation';
	import { KeyRoundIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let errorText = $state('');
	let errorField = $state('');
	let token = $state('');
	let userData = $state<LoadedData<resetUserData>>({
		state: 'pending',
		message: 'Validating URL...'
	});
	let stage = $state('before');
	let loading = $state(false);
	let counter = $state(5);

	const handleReset = async (e: SubmitEvent) => {
		e.preventDefault();
		if (loading || stage === 'updated') {
			return;
		}
		loading = true;
		errorText = '';
		errorField = '';
		const form = e?.target as HTMLFormElement;
		const formData = new FormData(form);

		const password = formData.get('password');
		const confirmPassword = formData.get('confirm_password');
		const error = validateReset(password, confirmPassword);
		if (error) {
			errorText = error;
			loading = false;
			return;
		}
		try {
			const res = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify({
					token: token,
					password: password,
					confirmPassword: confirmPassword
				})
			});

			const data = await res.json();
			errorText = '';
			loading = false;
			if (res.ok) {
				if (stage === 'before') {
					stage = 'updated';
				}
				form.reset();
				const timerid = setInterval(() => {
					if (counter > 1) {
						counter--;
					} else {
						clearInterval(timerid);
						goto('/login');
					}
				}, 1000);
			} else {
				errorText = data.message;
			}
		} catch (err) {
			loading = false;
			errorText = (err as Error).message || 'Something went wrong';
		}
	};

	onMount(() => {
		const fetchToken = async () => {
			token = page.url.searchParams.get('token') || '';
			try {
				const res = await fetch('/api/auth/verify-reset-token', {
					method: 'POST',
					headers: { 'Content-type': 'application/json' },
					body: JSON.stringify({
						token: token
					})
				});

				const data = await res.json();
				console.log(data);
				errorText = '';
				if (res.ok) {
					userData = {
						state: 'success',
						data: data.data
					};
				} else {
					userData = {
						state: 'failed',
						message: 'Invalid Link'
					};
				}
			} catch (err) {
				userData = {
					state: 'failed',
					message: 'Invalid Link'
				};
			}
		};
		fetchToken();
	});
</script>

<div class="flex h-screen w-full flex-col items-center bg-white p-10 text-black">
	{#if userData.state === 'pending'}
		<p class="text-lg">{userData.message}</p>
	{:else if userData.state === 'success'}
		<h1 class="text-3xl text-[#222222]">Reset Password</h1>
		<div class="mt-10 max-w-md border-1 border-black p-3 shadow-[4px_4px_0_0_black]">
			<form onsubmit={handleReset}>
				<div
					class="{errorText
						? 'block'
						: 'hidden'} mb-2 flex min-h-6 w-full items-center justify-start rounded bg-red-200 px-1 font-sans"
				>
					<p class="text-sm text-red-500">{errorText}</p>
				</div>
				<div
					class="{stage === 'updated'
						? 'block'
						: 'hidden'} mb-2 flex min-h-6 w-full items-center justify-start gap-x-2 rounded bg-green-200 px-2 py-4 font-sans"
				>
					<KeyRoundIcon color="green" />
					<p>
						Your password has been successfully reset. Redirecting to login page in <span
							>{counter}</span
						> seconds
					</p>
				</div>
				<p class="mb-4 font-sans text-sm">
					<span>{userData.data.name}</span> ,create a new strong password for your account:
					<span class="font-bold">{userData.data.email}</span>
				</p>
				<div
					class="//auto-cols-fr //grid-cols-[120px_auto] w-full place-items-start items-center gap-5"
				>
					<p class="text-md w-fit">New Password</p>
					<input
						name="password"
						class="mb-4 h-8 w-full rounded-xs border-1 border-black p-2 {errorField === 'password'
							? 'border-red-500'
							: ''}"
						type="password"
					/>
					<p class="text-md w-fit">Confirm Password</p>
					<input
						name="confirm_password"
						class="mb-4 h-8 w-full rounded-xs border-1 border-black p-2 {errorField ===
						'confirm_password'
							? 'border-red-500'
							: ''}"
						type="password"
					/>
				</div>
				<button
					type="submit"
					class="{stage === 'updated' ? 'hidden' : 'block'} w-full cursor-pointer {!loading
						? 'border-1 border-black bg-[#D9D9D9] hover:bg-black hover:text-white'
						: 'text-blue-400'} px-6 py-3 text-sm ease-in-out"
				>
					{#if !loading}
						<p>Reset Password</p>
					{:else}
						<p>Loading</p>
					{/if}
				</button>
			</form>
		</div>
	{:else}
		<p class="text-lg">{userData.message}</p>
	{/if}
</div>
