<script lang="ts">
	import '../../app.css';
	let { children } = $props();
</script>

<div class="h-screen w-screen overflow-auto bg-[#121212] text-white">
	{@render children?.()}
</div>
