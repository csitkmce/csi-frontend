<script>
	import LocalhostEventCard from '$lib/components/localhost/localhost-event-card.svelte';
</script>

<div class="flex h-full w-full flex-col items-center">
	<section>
		<div class="flex h-screen w-screen flex-col items-center justify-center">
			<img class="w-150" alt="LocalHost 26" src="localhost/LOCALHOST26.png" />
			<div class="mt-10 flex flex-col items-center font-akira text-2xl uppercase">
				<p>February</p>
				<p class="text-[#479DFF]">20 - 23</p>
			</div>
		</div>
	</section>
	<section class="relative flex flex-col items-center justify-center font-akira">
		<img
			class="absolute z-20 mx-auto my-auto w-40"
			alt="LH-scribble"
			src="localhost/LH-scribble.png"
		/>
		<div class="mt-10 mb-20 h-fit max-w-6xl p-5">
			<p class="text-justify text-sm text-[#BABABA] uppercase">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
				voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
				cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
			</p>
			<div class="mt-5 flex flex-col items-end">
				<p class="text-xs">CSI TKMCE TEAM</p>
				<img class="w-16" alt="scribble" src="localhost/scribble1.png" />
			</div>
		</div>
	</section>
	<section class="max-w-6xl px-5">
		<h2 class="font-akira text-2xl uppercase">Events</h2>
		<div class="flex">
			<div class="flex w-20 justify-center max-sm:hidden">
				<div class=" h-full border-l-2 border-dashed border-[#888888]"></div>
			</div>
			<div class="flex flex-col">
				<div class="my-5 flex items-center">
					<p class="font-akira text-xl text-[#479DFF] uppercase">20<sup>th</sup> February</p>
					<img class="relative top-[-5px] left-[-35px] w-20" alt="2026" src="localhost/2026.png" />
				</div>
				<LocalhostEventCard
					title="Inaguration"
					img=""
					desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
				voluptate velit esse cillum dolore eu fugiat nulla pariatur."
					time="4:30pm - 6:00pm"
					coordinators={['Farhaan - 8080808080', 'Farhaan - 8080808080']}
					venue="APJ Park"
					regStatus="closed"
				/>
				<div class="my-5 flex items-center">
					<p class="font-akira text-xl text-[#479DFF] uppercase">20<sup>th</sup> February</p>
					<img class="relative top-[-5px] left-[-35px] w-20" alt="2026" src="localhost/2026.png" />
				</div>
				<LocalhostEventCard
					title="Inaguration"
					img=""
					desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
				voluptate velit esse cillum dolore eu fugiat nulla pariatur."
					time="4:30pm - 6:00pm"
					coordinators={['Farhaan - 8080808080', 'Farhaan - 8080808080']}
					venue="APJ Park"
					regStatus="closed"
				/>
			</div>
		</div>
	</section>
</div>
