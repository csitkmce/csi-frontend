<script lang="ts">
  import { PUBLIC_API_URL } from "$env/static/public";
  import { onMount } from "svelte";

  interface Registration {
    registration_id: string;
    timestamp: string;
    event_id: string;
    event_name: string;
    venue: string;
    event_start_time: string;
    event_end_time: string;
    student_name: string;
    student_email: string;
    student_phone: string;
    department_id: string;
    batch: string;
    year: number;
    role: string;
    attendance_status: string;
    payment_status: boolean;
    food_preference: string;
    team_id: string;
    team_code: string;
    team_name: string;
    team_lead_name: string;
    team_lead_email: string;
    team_lead_phone: string;
  }

  interface GroupedTeam {
    team_id: string;
    team_code: string;
    team_name: string;
    team_lead_name: string;
    team_lead_email: string;
    team_lead_phone: string;
    event_name: string;
    venue: string;
    event_start_time: string;
    event_end_time: string;
    members: Registration[];
  }

  let registrations: Registration[] = [];
  let groupedTeams: GroupedTeam[] = [];
  let loading = true;

  // Department mapping
  const departmentMap: { [key: string]: string } = {
    "0e53c987-04a4-4de4-af4b-120d1ccd8995": "ECE",
    "3149e9e3-00bc-461b-be9f-c1b15b69b428": "CSE (AI)",
    "3f9a8b1a-7857-495a-a56a-326c9cdf39a4": "Mechanical",
    "5830cdf0-156d-4445-ac70-cac89d925a2c": "CSE",
    "7b38a161-56d4-4df7-af76-4fdf9e66ad62": "Architecture",
    "9734f72d-8ae1-49c4-b04e-735edeec4f2a": "EEE",
    "b7e58be0-7fb5-4030-b637-797c800e29de": "Chemical",
    "be67e7c8-c706-4aef-a848-adbbc951e3fc": "Civil",
    "c9c62a3b-a1ca-4f8c-9fad-de281706c448": "ECE (Computer)"
  };

  function getDepartmentName(departmentId: string): string {
    return departmentMap[departmentId] || departmentId.slice(0, 8) + "...";
  }

  function groupRegistrationsByTeam(registrations: Registration[]): GroupedTeam[] {
    const teamMap = new Map<string, GroupedTeam>();

    registrations.forEach(reg => {
      if (!teamMap.has(reg.team_id)) {
        teamMap.set(reg.team_id, {
          team_id: reg.team_id,
          team_code: reg.team_code,
          team_name: reg.team_name,
          team_lead_name: reg.team_lead_name,
          team_lead_email: reg.team_lead_email,
          team_lead_phone: reg.team_lead_phone,
          event_name: reg.event_name,
          venue: reg.venue,
          event_start_time: reg.event_start_time,
          event_end_time: reg.event_end_time,
          members: []
        });
      }
      teamMap.get(reg.team_id)!.members.push(reg);
    });

    return Array.from(teamMap.values());
  }

  onMount(async () => {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/admin/registrations`);
      const data = await res.json();
      if (data.success) {
        registrations = data.data;
        groupedTeams = groupRegistrationsByTeam(registrations);
      }
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      loading = false;
    }
  });
</script>

<div class="flex min-h-screen w-full max-w-7xl flex-col items-center bg-[#222222] border-x-1 border-black text-white">
  <div class="my-10 text-center">
    <h1 class="font-mono transition-transform max-sm:text-3xl text-4xl mb-4">
      Team Registrations
    </h1>
    {#if !loading && groupedTeams.length > 0}
      <div class="flex flex-wrap justify-center gap-6 text-lg">
        <div class="bg-[#313131] px-4 py-2 rounded-lg border border-gray-600">
          <span class="text-blue-400 font-semibold">Total Teams:</span>
          <span class="text-white font-bold ml-2">{groupedTeams.length}</span>
        </div>
        <div class="bg-[#313131] px-4 py-2 rounded-lg border border-gray-600">
          <span class="text-green-400 font-semibold">Total Participants:</span>
          <span class="text-white font-bold ml-2">{registrations.length}</span>
        </div>
        <div class="bg-[#313131] px-4 py-2 rounded-lg border border-gray-600">
          <span class="text-yellow-400 font-semibold">Paid:</span>
          <span class="text-white font-bold ml-2">{registrations.filter(r => r.payment_status).length}</span>
        </div>
        <div class="bg-[#313131] px-4 py-2 rounded-lg border border-gray-600">
          <span class="text-purple-400 font-semibold">Present:</span>
          <span class="text-white font-bold ml-2">{registrations.filter(r => r.attendance_status === 'present').length}</span>
        </div>
      </div>
    {/if}
  </div>

  {#if loading}
    <p class="p-4">Loading registrations...</p>
  {:else if groupedTeams.length === 0}
    <p class="p-4">No registrations found.</p>
  {:else}
    <div class="w-full max-w-6xl flex flex-col gap-6 p-4">
      {#each groupedTeams as team}
        <div class="border border-gray-600 rounded-lg bg-[#313131] overflow-hidden">
          <!-- Event & Team Header -->
          <div class="bg-[#404040] p-4 border-b border-gray-600">
            <div class="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h2 class="text-xl font-bold text-blue-400">{team.event_name}</h2>
                <p class="text-sm text-gray-300">{team.venue} • {new Date(team.event_start_time).toLocaleDateString()}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-green-400">{team.team_name}</p>
                <p class="text-sm text-gray-300">Code: <span class="font-mono text-yellow-400">{team.team_code}</span></p>
              </div>
            </div>
          </div>

          <!-- Team Lead Info -->
          <div class="bg-[#3a3a3a] p-3 border-b border-gray-600">
            <div class="flex flex-wrap gap-6 text-sm">
              <div><span class="text-gray-400">Team Lead:</span> <span class="font-semibold">{team.team_lead_name}</span></div>
              <div><span class="text-gray-400">Email:</span> {team.team_lead_email}</div>
              <div><span class="text-gray-400">Phone:</span> {team.team_lead_phone}</div>
            </div>
          </div>

          <!-- Team Members -->
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-3 text-gray-200">Team Members ({team.members.length})</h3>
            <div class="grid gap-3">
              {#each team.members as member, index}
                <div class="flex flex-wrap items-center justify-between p-3 rounded-md {index % 2 === 0 ? 'bg-[#414141]' : 'bg-[#4a4a4a]'}">
                  <div class="flex flex-wrap gap-4 text-sm">
                    <div class="font-semibold text-white">{member.student_name}</div>
                    <div class="text-gray-300">{member.student_email}</div>
                    <div class="text-gray-300">{member.student_phone}</div>
                    <div class="text-blue-300">{getDepartmentName(member.department_id)}</div>
                    <div class="text-gray-400">Year {member.year}</div>
                    <div class="text-purple-300">{member.food_preference}</div>
                  </div>
                  <div class="flex gap-3 text-xs">
                    <span class={member.payment_status ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                      {member.payment_status ? "PAID" : "UNPAID"}
                    </span>
                    <span class={
                      member.attendance_status === "present" ? "text-green-400 font-semibold" :
                      member.attendance_status === "absent" ? "text-red-400 font-semibold" :
                      "text-yellow-400 font-semibold"
                    }>
                      {member.attendance_status.toUpperCase()}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Team Summary -->
          <div class="bg-[#2a2a2a] p-3 text-xs text-gray-400 flex flex-wrap gap-4">
            <div>Total Members: {team.members.length}</div>
            <div>Paid: {team.members.filter(m => m.payment_status).length}</div>
            <div>Present: {team.members.filter(m => m.attendance_status === 'present').length}</div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>