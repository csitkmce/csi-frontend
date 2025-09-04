<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../../app.css';
	import { InstagramIcon, Linkedin, LinkedinIcon, MailIcon, Menu } from '@lucide/svelte';
	import { isLoggedin } from '$lib/stores/auth';
	import { PUBLIC_API_URL } from '$env/static/public';
	let { children, data } = $props();

	let isMenuOpen: boolean = $state(false);
	let activePage: string = $state('home');

	function toggleMenu(): void {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu(page: string): void {
		isMenuOpen = false;
		setActivePage(page);
	}

	function setActivePage(page: string) {
		activePage = page;
	}

	async function handleLoginLogout() {
		if ($isLoggedin) {
			isLoggedin.set(false);
			localStorage.removeItem('accessToken');
		} else {
			await goto('/login');
		}
	}

	onMount(async () => {
		const accessToken = localStorage.getItem('accessToken');

		if (!accessToken) {
			isLoggedin.set(false);
			return;
		}

		try {
			const res = await fetch(`/api/user/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
				credentials: 'include'
			});

			if (res.status === 401) {
				const resRefresh = await fetch(`/api/refresh/`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				});

				if (resRefresh.status === 401) {
					localStorage.removeItem('accessToken');
					isLoggedin.set(false);
					goto('/login');
				} else if (resRefresh.status === 200) {
					const { accessToken: newToken } = await resRefresh.json();
					localStorage.setItem('accessToken', newToken);
					isLoggedin.set(true);
				} else {
					throw new Error('Refresh request failed');
				}
			} else if (res.status === 200) {
				isLoggedin.set(true);
			} else {
				throw new Error('User request failed');
			}
		} catch (error) {
			console.error('Auth check failed:', error);
			localStorage.removeItem('accessToken');
			isLoggedin.set(false);
			goto('/login');
		}
	});
</script>

<svelte:head>
	<title>CSI TKMCE</title>
</svelte:head>

<div class="border-y-1 border-[#181818] bg-[#222222] font-mono text-white min-7xl:border-1">
	<header
		class="sticky top-0 z-10 flex h-20 w-full justify-center border-b-1 border-[#181818] bg-transparent backdrop-blur-2xl duration-300 ease-in-out"
	>
		<nav class="flex w-full max-w-7xl justify-between border-x-1 border-[#181818] p-5">
			<div class="flex items-center gap-2">
				<img class="h-10 text-white" src="/images/csi_logo.png" alt="organisation" />
			</div>
			<div class="flex cursor-pointer items-center min-sm:hidden">
				<button onclick={toggleMenu} aria-label="Toggle menu">
					<Menu />
				</button>
			</div>
			<div class="flex items-center max-sm:hidden">
				<ul class="flex gap-5 text-[#808080]">
					<li>
						<a
							onclick={() => {
								setActivePage('home');
							}}
							class={activePage === 'home' ? 'text-white' : ''}
							href="/">Home</a
						>
					</li>
					<li>
						<a
							onclick={() => {
								setActivePage('leaderboard');
							}}
							class={activePage === 'leaderboard' ? 'text-white' : ''}
							href="/leaderboard">LeaderBoard</a
						>
					</li>
					<li>
						<a
							onclick={() => {
								setActivePage('team');
							}}
							class={activePage === 'team' ? 'text-white' : ''}
							href="/team">Team</a
						>
					</li>
					<li>
						<a
							onclick={() => {
								setActivePage('events');
							}}
							class={activePage === 'events' ? 'text-white' : ''}
							href="/events">Events</a
						>
					</li>
					<li>
						<button class="cursor-pointer text-[#008CFF]" onclick={handleLoginLogout}
							>{$isLoggedin ? 'Logout' : 'Login'}</button
						>
					</li>
				</ul>
			</div>
		</nav>
	</header>
	{#if isMenuOpen}
		<div
			class="fixed inset-0 z-20 bg-[#00000050] min-sm:hidden"
			onclick={() => {
				closeMenu(activePage);
			}}
			onkeydown={(e) => e.key === 'Escape' && closeMenu(activePage)}
			role="button"
			tabindex="0"
		></div>

		<!-- Mobile menu -->
		<div
			class="fixed top-0 right-0 z-30 h-screen w-64 transform bg-[#222222] shadow-lg transition-transform duration-300 ease-in-out min-sm:hidden"
		>
			<div class="flex h-20 items-center justify-end border-b-1 border-[#181818] p-5">
				<button
					onclick={() => {
						closeMenu(activePage);
					}}
					aria-label="Toggle menu"
				>
					<Menu />
				</button>
			</div>

			<nav class="p-5">
				<ul class="space-y-4 text-[#808080]">
					<li>
						<a
							href="/"
							class="block py-2 text-lg {activePage === 'home' ? 'text-white' : ''}"
							onclick={() => {
								closeMenu('home');
							}}
						>
							Home
						</a>
					</li>
					<li>
						<a
							href="/leaderboard"
							class="block py-2 text-lg {activePage === 'leaderboard' ? 'text-white' : ''}"
							onclick={() => {
								closeMenu('leaderboard');
							}}
						>
							LeaderBoard
						</a>
					</li>
					<li>
						<a
							href="/team"
							class="block py-2 text-lg {activePage === 'team' ? 'text-white' : ''}"
							onclick={() => {
								closeMenu('team');
							}}
						>
							Team
						</a>
					</li>
					<li>
						<a
							href="/events"
							class="block py-2 text-lg {activePage === 'events' ? 'text-white' : ''}"
							onclick={() => {
								closeMenu('events');
							}}
						>
							Events
						</a>
					</li>
					<li>
						<button
							class="block cursor-pointer py-2 text-left text-lg text-[#008CFF]"
							onclick={async () => {
								closeMenu(activePage);
								await handleLoginLogout();
							}}
						>
							{$isLoggedin ? 'Logout' : 'Login'}
						</button>
					</li>
				</ul>
			</nav>
		</div>
	{/if}
	<main class="flex justify-center">
		{@render children?.()}
	</main>
	<footer class="flex justify-center border-t-1 border-[#181818] bg-[#222222] text-white">
		<div class="flex w-full max-w-7xl flex-col justify-center border-x-1 border-[#181818] p-4">
			<div class="min-sm:flex">
				<div class="flex flex-col justify-center">
					<img class="h-20 w-30 text-white" src="/images/csi_logo.png" alt="organisation" />
				</div>
				<div class="flex w-full items-end justify-end gap-4 p-5 max-sm:justify-start">
					<div class="rounded bg-[#444444] p-1">
						<LinkedinIcon />
					</div>
					<div class="rounded bg-[#444444] p-1">
						<InstagramIcon />
					</div>
					<div class="rounded bg-[#444444] p-1">
						<MailIcon />
					</div>
				</div>
			</div>
			<div class="left-20 bg-[#222222] p-2 text-xs text-[#818181]">
				<a class="w-full text-[10px] text-[#707070]" href="https://storyset.com/technology"
					>Technology illustrations by Storyset</a
				>
				<p class="mt-2">© Copyright CSI TKMCE. All Rights Reserved</p>
			</div>
		</div>
	</footer>
</div>
