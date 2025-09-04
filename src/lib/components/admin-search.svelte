<script lang="ts">
	import { Search } from "@lucide/svelte";

    let {
        searchText,
        onSearch,
    } : {
        searchText : string;
        onSearch : Function;
    } = $props();
</script>
<div class="mt-4 flex min-h-10 w-full items-center gap-2">
	<input placeholder="Search user" bind:value={searchText} class="h-full w-full rounded bg-[#353535] px-2 py-1" />
	<button onclick={()=>{onSearch()}} class="flex h-full cursor-pointer items-center gap-2 rounded bg-[#505050] px-2">
		<p class="text-sm max-sm:hidden">Search</p>
		<Search size="20" />
	</button>
</div>
