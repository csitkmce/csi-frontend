<div
	class="flex min-h-screen w-full max-w-7xl flex-col items-center border-x-1 border-black bg-[#222222] text-white"
>
	<h1 class="my-10 text-3xl transition-transform">Admin Dashboard</h1>
	<div class="w-full max-w-4xl grid-cols-2 flex-col gap-2 p-2 font-mono max-sm:flex min-sm:grid">
		<div class="my-2 flex flex-col border-1 border-black p-4 min-sm:w-full">
			<h2>People</h2>
			<div
				class="mt-2 flex flex-col [&>*:nth-child(even)]:bg-[#767676] [&>*:nth-child(odd)]:bg-[#313131]"
			>
				<div class="flex items-center p-2">
					<a href="/admin/users">Manage Users</a>
				</div>
				<div class="flex items-center p-2">
					<a href="/admin/execom">Manage Execom Members</a>
				</div>
				<div class="flex items-center p-2">
					<a href="/admin/dashboard">Call For Execom</a>
				</div>
			</div>
		</div>
		<div class="my-2 flex flex-col border-1 border-black p-4 min-sm:w-full">
			<h2>Events</h2>
			<div
				class="mt-2 flex flex-col [&>*:nth-child(even)]:bg-[#767676] [&>*:nth-child(odd)]:bg-[#313131]"
			>
				<div class="flex items-center p-2">
					<a href="/admin/dashboard">Manage Events</a>
				</div>
				<div class="flex items-center p-2">
					<a href="/admin/05db9e64-c139-442a-8895-0aaa547077dd">Manage Registration</a>
				</div>
			</div>
		</div>
		<div class="my-2 flex flex-col border-1 border-black p-4 min-sm:w-full">
			<h2>Others</h2>
			<div
				class="mt-2 flex flex-col [&>*:nth-child(even)]:bg-[#767676] [&>*:nth-child(odd)]:bg-[#313131]"
			>
				<div class="flex items-center p-2">
					<a href="/admin/dashboard">Manage Departments</a>
				</div>
				<div class="flex items-center p-2">
					<a href="/admin/dashboard">Manage Execom Positions</a>
				</div>
			</div>
		</div>
		<div class="my-2 flex flex-col border-1 border-black p-4 min-sm:w-full">
			<h2>Admin Settings</h2>
			<div
				class="mt-2 flex flex-col [&>*:nth-child(even)]:bg-[#767676] [&>*:nth-child(odd)]:bg-[#313131]"
			>
				<div class="flex items-center p-2">
					<a href="/admin/dashboard">Manage Admins</a>
				</div>
				<div class="flex items-center p-2">
					<a href="/admin/dashboard">Change Password</a>
				</div>
			</div>
		</div>
	</div>
</div>
