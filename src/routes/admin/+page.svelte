<svelte:head>
	<title>CSI - Admin side</title>
</svelte:head>

<div class="flex min-h-screen w-full max-w-7xl flex-col items-center bg-[#222222] border-x-1 border-black text-white">
	<h1 class="mt-10 font-mono text-2xl">CSI Admin Login</h1>
	<div class="mt-10 min-w-sm border-1 border-black shadow-[4px_4px_0_0_black]">
		<div class="flex w-full justify-between border-b-1 border-black">
			<div class="flex items-center justify-center gap-4 p-4">
				<div class="h-3 w-3 rounded-full bg-red-500"></div>
				<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
				<div class="h-3 w-3 rounded-full bg-green-500"></div>
			</div>
			<h3 class="w-fit bg-black p-4">Login</h3>
		</div>
		<div class="flex w-full flex-col items-center p-4">
			<div class="grid w-full auto-cols-fr grid-cols-[120px_auto] gap-5">
				<p class="text-md w-fit">Email</p>
				<input class="h-8 w-full rounded-xs border-1 border-black p-2" type="email" />
				<p class="text-md w-fit">Password</p>
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
