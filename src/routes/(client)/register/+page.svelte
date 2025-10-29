<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { isLoggedin } from '$lib/stores/auth';
	import { validateRegistration } from '$lib/utils/validation';
	import { onMount } from 'svelte';

	const batches: string[] = ['A', 'B', 'C'];

	let deptList: { department_id: string; name: string }[] = $state([]);
	let errorText = $state('');
	let errorField = $state('');

	onMount(async () => {
		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/data/getDepts`);
			if (res.ok) {
				const data = await res.json();
				deptList = data.map((d: { department_id: string; department_name: string }) => ({
					department_id: d.department_id,
					name: d.department_name
				}));
			}
		} catch (err) {
			console.error('Failed to load departments', err);
		}
	});

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const payload = {
			name: formData.get('name'),
			email: formData.get('email'),
			college: formData.get('college'),
			department: formData.get('department'),
			batch: formData.get('batch'),
			year: formData.get('year'),
			phone_number: formData.get('phone_number'),
			password: formData.get('password'),
			confirm_password: formData.get('confirm_password')
		};

		const error = validateRegistration(
			payload.name,
			payload.email,
			payload.college,
			payload.department,
			payload.batch,
			payload.year,
			payload.phone_number,
			payload.password,
			payload.confirm_password
		);
		if (error) {
			errorText = error;
			return;
		}

		try {
			const res = await fetch(`${PUBLIC_API_URL}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const data = await res.json();
			console.log('data:', data);

			if (res.ok) {
				localStorage.setItem('accessToken', data.accessToken);
				isLoggedin.set(true);
				await invalidateAll();
				await goto('/');
			} else {
				errorText = data.message || 'Registration failed';
				errorField = data.errorfield || '';
			}
		} catch (err) {
			errorText = (err as Error).message || 'Registration failed';
			errorField = '';
		}
	};
</script>

<div class="flex min-h-screen w-full flex-col items-center bg-white p-10 text-sm text-black">
	<h1 class="text-3xl text-[#222222]">WELCOME TO CSI</h1>
	<div class="mt-10 min-w-sm border-1 border-black shadow-[4px_4px_0_0_black]">
		<div class="flex w-full justify-between border-b-1 border-black bg-neutral-200">
			<div class="flex items-center justify-center gap-4 p-4">
				<div class="h-3 w-3 rounded-full bg-red-500"></div>
				<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
				<div class="h-3 w-3 rounded-full bg-green-500"></div>
			</div>
			<h3 class="//bg-[#BFBFBF] w-fit bg-neutral-300 p-4 text-neutral-400">Register</h3>
		</div>
		<form onsubmit={handleSubmit}>
			<div class="flex w-full flex-col items-center p-4">
				<div
					class="{errorText
						? 'visible'
						: 'invisible'} mb-4 flex min-h-6 w-full items-center justify-start rounded bg-red-200 px-1 font-sans"
				>
					<p class="text-sm text-red-500">{errorText}</p>
				</div>
				<div
					class="//auto-cols-fr //grid-cols-[140px_auto] w-full place-items-start items-center gap-5"
				>
					<p class="text-md w-fit">Name</p>
					<input
						name="name"
						class="mb-4 h-8 w-full rounded-xs border-1 border-black p-2 {errorField === 'name'
							? 'border-red-500'
							: ''}"
						type="text"
					/>
					<p class="text-md w-fit">Email</p>
					<input
						name="email"
						class="mb-4 h-8 w-full rounded-xs border-1 border-black p-2 {errorField === 'email'
							? 'border-red-500'
							: ''}"
						type="email"
					/>
					<p class="text-md w-fit">College Name</p>
					<input
						name="college"
						class="mb-4 h-8 w-full rounded-xs border-1 border-black p-2 {errorField === 'college'
							? 'border-red-500'
							: ''}"
						type="text"
					/>
					<p class="text-md w-fit">Branch</p>
					<select
						name="department"
						class="mb-4 flex h-8 w-full items-center rounded-xs border-1 border-black {errorField ===
						'department'
							? 'border-red-500'
							: ''}"
					>
						{#each deptList as dept (dept.department_id)}
							<option value={dept.department_id}>{dept.name}</option>
						{/each}
					</select>
					<p class="text-md w-fit">Batch</p>
					<select
						name="batch"
						class="mb-4 flex h-8 w-full items-center rounded-xs border-1 border-black {errorField ===
						'batch'
							? 'border-red-500'
							: ''}"
					>
						{#each batches as batch}
							<option>{batch}</option>
						{/each}
					</select>
					<p class="text-md w-max">Graduation Year</p>
					<input
						name="year"
						class="mb-4 h-8 w-full rounded-xs border-1 border-black p-2 {errorField ===
						'phone_number'
							? 'border-red-500'
							: ''}"
						type="number"
					/>
					<p class="text-md w-fit">Phone</p>
					<input
						name="phone_number"
						class="mb-4 h-8 w-full rounded-xs border-1 border-black p-2 {errorField ===
						'phone_number'
							? 'border-red-500'
							: ''}"
						type="tel"
					/>
					<p class="text-md w-fit">Password</p>
					<input
						name="password"
						class="mb-4 h-8 w-full rounded-xs border-1 border-black p-2 {errorField === 'password'
							? 'border-red-500'
							: ''}"
						type="password"
					/>
					<p class="text-md w-max">Confirm Password</p>
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
					class="m-4 cursor-pointer border-1 border-black bg-[#D9D9D9] px-6 py-3 ease-in-out hover:bg-black hover:text-white"
				>
					Register
				</button>
			</div>
		</form>
	</div>
	<div class="mt-4 flex justify-center gap-2 text-sm">
		<p>Already have an account?</p>
		<a class="text-[#008CFF]" href="/login">Login Here</a>
	</div>
</div>
