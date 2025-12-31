<script lang="ts">
	let {
		title,
		img,
		desc,
		time,
		regStatus,
		coordinators,
		venue
	}: {
		title: string;
		img: string;
		desc: string;
		time: string;
		regStatus: 'now' | 'almost' | 'closed';
		coordinators: Array<string>;
		venue: string;
	} = $props();
</script>

<div class="relative mb-5 flex border-1 border-[#BABABA] max-sm:flex-col-reverse">
	<div class=" absolute top-1/2 left-[-38px] w-9 border-b-2 border-dashed border-[#888888]"></div>
	<div class="flex flex-1 flex-col items-start">
		<div class="flex flex-col p-5">
			<h3 class="font-akira text-lg uppercase">{title}</h3>
			<p class="mt-3 max-w-4xl text-justify font-mono text-sm text-[#BABABA]">
				{desc}
			</p>
		</div>
		<div class="flex w-full gap-x-3 bg-white px-5 py-1">
			<p class="font-akira text-base text-black uppercase">TIME :</p>
			<p class="font-akira text-base text-[#479DFF] uppercase">{time}</p>
		</div>
		<!-- Fix the track width issue -->
		{#if regStatus === 'now'}
			<div class="marquee-container flex items-center bg-[#5AED4C] px-5">
				<div class="marquee-track flex overflow-hidden font-akira text-base text-white uppercase">
					<span>Registration NOW</span>
					<span>Registration NOW</span>
				</div>
			</div>
		{:else if regStatus === 'almost'}
			<div class="marquee-container flex items-center bg-[#FFB145] px-5">
				<div class="marquee-track flex overflow-hidden font-akira text-base text-white uppercase">
					<span>ALMOST FULL</span>
					<span>ALMOST FULL</span>
				</div>
			</div>
		{:else}
			<div class="marquee-container flex items-center bg-[#FF1616] px-5">
				<div class="marquee-track flex overflow-hidden font-akira text-base text-white uppercase">
					<span>CLOSED</span>
					<span>CLOSED</span>
				</div>
			</div>
		{/if}
		<div class="flex w-full justify-between gap-y-5 p-5 font-mono max-sm:flex-col">
			<div>
				<p class="text-sm">Coordinators</p>
				<div class="mt-2 text-sm text-[#BABABA]">
					{#each coordinators as coordinator}
						<p>{coordinator}</p>
					{/each}
				</div>
			</div>
			<div>
				<p class="text-sm">Venue</p>
				<div class="mt-2 text-sm text-[#BABABA]">
					<p>{venue}</p>
				</div>
			</div>
		</div>
	</div>
	<div>
		<img class="aspect-square h-full w-50 bg-[#BABABA] max-sm:w-full" alt="poster" src={img} />
	</div>
</div>
