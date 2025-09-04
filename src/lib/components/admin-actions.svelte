<script lang="ts">
	let {
		dm_choices,
        selected,
        onGo,
	}: {
		dm_choices: string[];
        selected : string;
        onGo : Function;
	} = $props();
</script>

<div class="mt-4 flex h-8 w-full items-center justify-start">
	<p class="text-sm">Actions:</p>
	<select bind:value={selected} class="ml-2 h-full min-w-30 rounded bg-[#353535]">
		{#each dm_choices as choice}
			<option value={choice}>{choice}</option>
		{/each}
	</select>
	<button onclick={()=>{onGo()}} class="ml-2 h-full rounded bg-[#505050] px-2">Go</button>
</div>
