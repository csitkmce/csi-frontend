<script lang="ts">
  import { onMount } from "svelte";
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { PUBLIC_API_URL } from '$env/static/public';
  import { isLoggedin } from '$lib/stores/auth';
  import type { Event, User } from '$lib/types';

  let isCreate = true;
  let details: { event?: Event; user?: User } = {};
  let teamName = "";   // for create
  let teamCode = "";   // for join
  let loading = false;
  let error = "";
  let success = "";

  function toggleMode(mode: 'create' | 'join') {
    isCreate = mode === 'create';
  }

  onMount(async () => {
    const accessToken = localStorage.getItem('accessToken');
    const eventId = $page.params.event_id;

    if (!accessToken) {
      await invalidateAll();
      await goto('/login');
      return;
    }

    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/events/${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        credentials: 'include'
      });

      if (res.status === 401) {
        localStorage.removeItem('accessToken');
        isLoggedin.set(false);
        goto('/login');
      } else if (res.ok) {
        details = await res.json();
        isLoggedin.set(true);
      } else {
        throw new Error('Failed to fetch event details');
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem('accessToken');
      isLoggedin.set(false);
      goto('/login');
    }
  });

  async function register() {
    error = "";
    success = "";
    loading = true;

    const accessToken = localStorage.getItem('accessToken');
    const eventId = $page.params.event_id;

    if (!accessToken) {
      error = "You must be logged in.";
      loading = false;
      return;
    }

    try {
      const endpoint = isCreate ? "/api/register" : "/api/register/join-team";
      const body = isCreate 
        ? { eventId, teamName }
        : { eventId, teamCode };

      const res = await fetch(`${PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        error = data.message || "Registration failed";
        return;
      }

      success = isCreate 
        ? "✅ Team created successfully!"
        : "✅ Joined team successfully!";

      console.log("Registration success:", data);
      goto("/");
    } catch (err) {
      console.error(err);
      error = "Something went wrong.";
    } finally {
      loading = false;
    }
  }
  let teamMembers: { name: string; email: string }[] = [];

async function checkTeam() {
  error = "";
  success = "";
  teamMembers = [];

  const accessToken = localStorage.getItem("accessToken");
  if (!teamCode) {
    error = "Please enter a team code.";
    return;
  }

  try {
    const res = await fetch(`${PUBLIC_API_URL}/api/register/teams/${teamCode}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      error = "Invalid team code.";
      return;
    }

    const data = await res.json();
teamMembers = Array.isArray(data.data.members) ? data.data.members : [];

success = "✅ Team found!";

  } catch (err) {
    console.error(err);
    error = "Could not fetch team details.";
  }
}

</script>



<div class="flex w-full flex-col items-start justify-start gap-y-2 overflow-hidden p-4">
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Event Name:</h3>
		<p class="text-lg">{details.event?.name}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Name:</h3>
		<p class="text-lg">{details.user?.name}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Email:</h3>
		<p class="text-lg">{details.user?.email}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Department:</h3>
		<p class="text-lg">{details.user?.department}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Batch:</h3>
		<p class="text-lg">{details.user?.batch}</p>
	</div>
	<div class="flex gap-x-2 max-sm:flex-col">
		<h3 class="max-sm:text-md text-[#757575] min-sm:text-lg">Graduation Year:</h3>
		<p class="text-lg">{details.user?.year}</p>
	</div>
	<div class="mt-2 flex w-full items-center gap-1 rounded-md bg-[#404040] p-1">
		<button
			onclick={() => {
				toggleMode('create');
			}}
			class="w-full rounded {isCreate ? 'bg-[#222222]' : ''} p-1"
		>
			Create Team
		</button>
		<button
			onclick={() => {
				toggleMode('join');
			}}
			class="w-full rounded {!isCreate ? 'bg-[#222222]' : ''} p-1"
		>
			Join Team
		</button>
	</div>
	<div class="w-full rounded-lg bg-[#303030] p-2">
		{#if isCreate}
			<form class="flex flex-col items-center">
				<div class="flex w-full flex-col px-2">
					<ul class="ml-4 list-disc space-y-2">
						<li><p>On creating a team, you get a unique team code</p></li>
						<li><p>You will be the team leader</p></li>
						<li><p>Others can use this code to join your team</p></li>
					</ul>
					<label for="teamName" class="mt-4 mb-2">Enter your team name below:</label>
					<input
						id="teamName"
						name="teamName"
						placeholder="Team name"
						bind:value={teamName}
						class="h-8 w-full rounded bg-[#505050] p-2"
						type="text"
					/>
				</div>
				<div class="flex w-full items-center justify-center">
					<button onclick={(e) => {
      e.preventDefault();
      register();
    }}
						class="m-4 cursor-pointer border-1 border-black bg-[#ffffff] px-6 py-3 text-black ease-in-out hover:bg-[#222222] hover:text-white"
					>
						Create Team
					</button>
				</div>
			</form>
		{:else}
  <form class="flex flex-col items-center">
    <div class="flex w-full flex-col px-2">
      <label for="teamCode" class="mt-4 mb-2">Enter team code below:</label>
      <div class="flex items-center gap-x-2">
        <input
          id="teamCode"
          name="teamCode"
          placeholder="Team code"
          bind:value={teamCode}
          class="h-8 w-full rounded bg-[#505050] p-2"
          type="text"
        />
        <button
          onclick={async (e) => {
            e.preventDefault();
            await checkTeam();
          }}
          class="cursor-pointer rounded bg-[#222222] px-3 py-1"
        >
          Check
        </button>
      </div>
    </div>

    <div class="mt-8 w-full px-2">
      <p class="text-lg">Team members</p>
      <ul class="text-md mt-2 ml-4 list-disc space-y-2">
        {#if teamMembers.length > 0}
          {#each teamMembers as member}
            <li><p>{member.name} ({member.email})</p></li>
          {/each}
        {:else}
          <li><p>No members found yet.</p></li>
        {/if}
      </ul>
    </div>

    <div class="flex w-full items-center justify-center">
      <button
        onclick={(e) => {
          e.preventDefault();
          register();
        }}
        class="m-4 cursor-pointer border-1 border-black bg-[#ffffff] px-6 py-3 text-black ease-in-out hover:bg-[#222222] hover:text-white"
      >
        Join Team
      </button>
    </div>
  </form>
{/if}

	</div>
</div>