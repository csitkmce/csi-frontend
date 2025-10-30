<svelte:head>
	<title>CSI - Admin side</title>
</svelte:head>

<div
	class="flex min-h-screen w-full max-w-7xl flex-col items-center border-x-1 border-black bg-[#222222] text-white"
>
	<h1 class="mt-10 font-mono text-2xl">CSI Admin Login</h1>
	<div class="mt-10 min-w-sm border-1 border-black shadow-[4px_4px_0_0_black]">
		<div class="flex w-full justify-between border-b-1 border-black bg-neutral-900">
			<div class="flex items-center justify-center gap-4 p-4">
				<div class="h-3 w-3 rounded-full bg-red-500"></div>
				<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
				<div class="h-3 w-3 rounded-full bg-green-500"></div>
			</div>
			<h3 class="//bg-[#BFBFBF] w-fit bg-neutral-800 p-4 text-neutral-700">Login</h3>
		</div>
		<div class="flex w-full flex-col items-center bg-neutral-800 p-4">
			<div
				class="//auto-cols-fr //grid-cols-[120px_auto] w-full place-items-start items-center gap-5"
			>
				<p class="text-md w-fit font-sans">Email</p>
				<input class="mb-4 h-8 w-full rounded-xs border-1 border-black p-2" type="email" />
				<p class="text-md w-fit font-sans">Password</p>
				<input class="h-8 w-full rounded-xs border-1 border-black p-2" type="password" />
			</div>
			<button
				class="m-4 cursor-pointer border-1 border-black bg-black px-6 py-3 ease-in-out hover:bg-white hover:text-black"
			>
				Login
			</button>
		</div>
	</div>
</div>
