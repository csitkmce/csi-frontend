<div
	class="mx-auto grid w-full max-w-7xl grid-cols-2 place-items-start justify-center gap-2 border-x-1 border-[#181818] p-5 sm:grid-cols-3 md:grid-cols-4"
>
	{#each [1, 2, 3, 4] as card}
		<div
			class="m-3 animate-pulse flex w-40 flex-col items-center overflow-hidden border-1 border-black shadow-[4px_4px_black] lg:w-50"
		>
			<div
				class="aspect-1 flex h-40 w-full items-center justify-center overflow-hidden bg-[#303030]"
			></div>
			<div class="flex w-full flex-col items-start">
				<div class="mt-2 ml-2 h-5 w-30 bg-[#404040]"></div>
				<div class="mt-2 ml-2 h-5 w-20 bg-[#999999]"></div>
			</div>
			<div class="mt-auto mb-2 flex w-full justify-end p-2">
				<div class="h-5 w-5 bg-[#404040]"></div>
			</div>
		</div>
	{/each}
</div>
