<script lang="ts">
	import type { UserDataRow } from '$lib/types';
	import AdminTitleBtn from '$lib/components/admin-title-btn.svelte';
	import AdminSearch from '$lib/components/admin-search.svelte';
	import ActionsPane from '$lib/components/admin-actions.svelte';

	let dm_choices = ['Delete'];
	let searchText: string = $state('');
	let selected: string = dm_choices[0];
	let users: UserDataRow[] = [
		{
			status: false,
			id: 123,
			name: 'User1',
			email: 'randomuser@example.com',
			phone_number: '8080808080',
			department: 'Computer Science',
			batch: 'B',
			year: 2025,
			role: 'student'
		},
		{
			status: false,
			id: 124,
			name: 'User2',
			email: 'randomuser@example.com',
			phone_number: '8080808080',
			department: 'Computer Science',
			batch: 'B',
			year: 2025,
			role: 'student'
		},
		{
			status: false,
			id: 125,
			name: 'User3',
			email: 'randomuser@example.com',
			phone_number: '8080808080',
			department: 'Computer Science',
			batch: 'B',
			year: 2025,
			role: 'student'
		}
	];

	function onAddClick() {
		//
	}

	function onSearch() {
		//
	}

	function onActionGo() {
		//
	}
</script>

<div
	class="flex min-h-screen w-full max-w-7xl flex-col items-center border-x-1 border-black bg-[#222222] p-4 text-white"
>
	<AdminTitleBtn
		title="Manage Execom Members"
		buttonText="Add Member"
		onPrimaryClick={onAddClick}
	/>
	<!-- Search bar -->
	<AdminSearch {searchText} {onSearch} />

	<!-- Actions pane -->
	<ActionsPane {dm_choices} {selected} onGo={onActionGo} />

	<!-- Main body -->
	<div class="mt-4 w-full overflow-auto border-1 border-black text-[#eeeeee]">
		<table class="table-fixed">
			<thead class="bg-black">
				<tr>
					<th class="min-w-10 border"><input type="checkbox" /></th>
					<th class="min-w-20 border p-2 text-sm">UserID</th>
					<th class="min-w-50 border p-2 text-left text-sm">Name</th>
					<th class="min-w-80 border p-2 text-left text-sm">Email</th>
					<th class="min-w-40 border p-2 text-left text-sm">Phone number</th>
					<th class="min-w-50 border p-2 text-left text-sm">Deapartment</th>
					<th class="min-w-30 border p-2 text-sm">Batch</th>
					<th class="min-w-30 border p-2 text-sm">Year</th>
					<th class="min-w-30 border p-2 text-sm">Role</th>
				</tr>
			</thead>
			<tbody>
				{#each users as user (user.id)}
					<tr class="odd:bg-[#353535]">
						<th class="min-w-10 border"><input type="checkbox" checked={user.status} /></th>
						<th class="border p-2 text-sm">{user.id}</th>
						<th class="border p-2 text-left text-sm">{user.name}</th>
						<th class="border p-2 text-left text-sm">{user.email}</th>
						<th class="border p-2 text-left text-sm">{user.phone_number}</th>
						<th class="border p-2 text-left text-sm">{user.department}</th>
						<th class="border p-2 text-sm">{user.batch}</th>
						<th class="border p-2 text-sm">{user.year}</th>
						<th class="border p-2 text-sm">{user.role}</th>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
