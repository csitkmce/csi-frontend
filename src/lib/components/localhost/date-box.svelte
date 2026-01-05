<script lang="ts">
	let { raw_date }: { raw_date: string } = $props();

	const dateComp = raw_date.split(' ');
	const date = dateComp[2];
	const month = dateComp[1];
</script>

<div class="my-5 flex items-center">
	<p class="font-akira text-xl text-[#479DFF] uppercase">{date}<sup>th</sup> {month}</p>
	<img class="relative top-[-5px] left-[-35px] w-20" alt="2026" src="localhost/2026.png" />
</div>
