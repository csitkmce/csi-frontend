<script lang="ts">
	import { validateEmail } from '$lib/utils/validation';

	let errorText = $state('');
	let email = $state('');
	let loading = $state(false);
	let stage = $state('first'); // first, resend

	const handleSendLink = async () => {
		if (loading) {
			return;
		}
		loading = true;
		errorText = '';
		const error = validateEmail(email);
		if (error) {
			errorText = error;
			loading = false;
			return;
		}
		try {
			const res = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify({
					email: email
				})
			});

			const data = await res.json();
			errorText = '';
			loading = false;
			if (res.ok) {
				if (stage === 'first') {
					stage = 'resend';
				}
			} else {
				errorText = data.error || data.message || 'Something went wrong';
			}
		} catch (err) {
			loading = false;
			errorText = (err as Error).message || 'Something went wrong';
		}
	};
</script>

<div class="flex h-screen w-full flex-col items-center bg-white p-10 text-black">
	<h1 class="text-3xl text-[#222222]">Forgot Password</h1>
	<div class="mt-10 max-w-lg min-w-sm border-1 border-black p-3 shadow-[4px_4px_0_0_black]">
		<div
			class="{errorText
				? 'block'
				: 'hidden'} mb-2 flex min-h-6 w-full items-center justify-start rounded bg-red-200 px-1 font-sans"
		>
			<p class="text-sm text-red-500">{errorText}</p>
		</div>
		<p class="text-justify font-sans text-sm text-neutral-500">
			You’ll receive an email with a password reset link. Click the link to go to the reset password
			page. The link will be valid for 15 minutes.
		</p>

		<p class="mt-4 font-sans text-sm">Enter your registered email address</p>
		<input
			name="email"
			bind:value={email}
			class="mt-2 h-8 w-full rounded-xs border-1 border-black p-2 {errorText !== ''
				? 'border-red-500'
				: ''}"
			type="email"
		/>

		{#if stage === 'first'}
			<button
				onclick={handleSendLink}
				class="mt-4 w-full cursor-pointer {!loading
					? 'border-1 border-black bg-[#D9D9D9] hover:bg-black hover:text-white'
					: 'text-blue-400'} px-6 py-3 text-sm ease-in-out"
			>
				{#if !loading}
					<p>Send me reset link</p>
				{:else}
					<p>Loading</p>
				{/if}
			</button>
		{:else}
			<button
				onclick={handleSendLink}
				class="mt-4 w-full cursor-pointer px-6 py-3 text-sm text-blue-400 ease-in-out hover:bg-blue-100"
			>
				{#if !loading}
					<p>Resend link</p>
				{:else}
					<p>Loading</p>
				{/if}
			</button>
		{/if}
	</div>
</div>
