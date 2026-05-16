<script lang="ts">
	let {
		onRegisterClick
	}: {
		onRegisterClick: () => void;
	} = $props();
</script>

<div class="my-4 flex flex-col items-start bg-blue-900 px-4 py-2 font-sans text-sm text-blue-300">
	<h2 class="text-lg font-bold">Execom Call (2026-27)</h2>
	<p class="mt-1 text-justify">
		CSI TKMCE proudly invites enthusiastic, motivated, and visionary students to be part of the new
		Executive Committie (Execom) for the upcoming term
	</p>
	<button
		onclick={onRegisterClick}
		class="mt-4 cursor-pointer bg-blue-950 px-2 py-1 text-sm font-bold text-blue-200 hover:scale-x-105"
		>Register</button
	>
</div>
