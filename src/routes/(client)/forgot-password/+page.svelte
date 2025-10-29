<script lang="ts">
	let errorText = $state('');
	let errorField = $state('');
</script>

<div class="flex h-screen w-full flex-col items-center bg-white p-10 text-black">
	<h1 class="text-3xl text-[#222222]">Forgot Password</h1>
	<div class="mt-10 max-w-lg min-w-sm border-1 border-black p-3 shadow-[4px_4px_0_0_black]">
		<p class="text-sm text-neutral-500">
			You’ll receive an email with a password reset link. Click the link to go to the reset password
			page. The link will be valid for 15 minutes.
		</p>
		<p class="mt-4 text-sm">Enter your registered email address</p>
		<input
			name="email"
			class="mt-2 h-8 w-full rounded-xs border-1 border-black p-2 {errorField === 'email'
				? 'border-red-500'
				: ''}"
			type="email"
		/>

		<button
			type="submit"
			class="mt-4 w-full cursor-pointer border-1 border-black bg-[#D9D9D9] px-6 py-3 text-sm ease-in-out hover:bg-black hover:text-white"
		>
			Send me reset link
		</button>
	</div>
</div>
