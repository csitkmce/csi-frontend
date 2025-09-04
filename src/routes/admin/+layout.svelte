<script lang="ts">
	import '../../app.css';
	import { Menu } from '@lucide/svelte';
	let { children } = $props();

	let isMenuOpen: boolean = $state(false);

	function toggleMenu(): void {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu(): void {
		isMenuOpen = false;
	}
</script>

<svelte:head>
	<title>CSI TKMCE</title>
</svelte:head>
<div class="bg-[#222222] border-y-1 min-7xl:border-1 border-black font-mono text-white">
	<header
		class="sticky top-0 z-10 flex h-20 w-full justify-center border-b-1 border-black bg-transparent backdrop-blur-2xl duration-300 ease-in-out"
	>
		<nav class="flex w-full max-w-7xl justify-between border-x-1 border-black p-5">
			<div class="flex items-center gap-2">
				<img class="h-10 text-white" src="/images/csi_logo.png" alt="organisation" />
			</div>
			<div class="flex cursor-pointer items-center min-sm:hidden">
				<button onclick={toggleMenu} aria-label="Toggle menu">
					<Menu />
				</button>
			</div>
			<div class="flex items-center max-sm:hidden">
				<ul class="flex gap-5">
					<li class="text-[#008CFF]">
						<a href="/events">Logout</a>
					</li>
				</ul>
			</div>
		</nav>
	</header>
	{#if isMenuOpen}
		<div
			class="fixed inset-0 z-20 bg-[#00000050] min-sm:hidden"
			onclick={closeMenu}
			onkeydown={(e) => e.key === 'Escape' && closeMenu()}
			role="button"
			tabindex="0"
		></div>

		<!-- Mobile menu -->
		<div
			class="fixed top-0 right-0 z-30 h-screen w-64 transform bg-[#222222] shadow-lg transition-transform duration-300 ease-in-out min-sm:hidden"
		>
			<div class="flex h-20 items-center justify-end border-b-1 border-black p-5">
				<button onclick={closeMenu} aria-label="Toggle menu">
					<Menu />
				</button>
			</div>

			<nav class="p-5">
				<ul class="space-y-4">
					<li>
						<a
							href="/"
							class="block py-2 text-lg text-[#008CFF] transition-colors hover:text-gray-300"
							onclick={closeMenu}
						>
							Logout
						</a>
					</li>
				</ul>
			</nav>
		</div>
	{/if}
	<main class="flex justify-center">
		{@render children?.()}
	</main>
</div>
