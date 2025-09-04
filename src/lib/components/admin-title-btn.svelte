<script lang="ts">
	import { Plus } from '@lucide/svelte';

	let {
		title,
        buttonText,
        onPrimaryClick,
	}: {
		title: string;
        buttonText: string;
        onPrimaryClick: Function
	} = $props();
</script>

<div class="flex min-h-10 w-full items-center justify-between">
	<h1 class="w-full text-left text-lg">{title}</h1>
	<button onclick={onPrimaryClick()} class="h-full min-w-40 cursor-pointer rounded bg-white px-2 text-[#505050] max-sm:hidden"
		>{buttonText}</button
	>
	<button class="aspect-1 flex h-10 w-10 items-center justify-center rounded bg-white min-sm:hidden"
		><Plus color="black" /></button
	>
</div>
