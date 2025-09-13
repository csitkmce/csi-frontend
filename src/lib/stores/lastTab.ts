import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const stored = browser ? localStorage.getItem('lastTab') : null;

export const lastTab = writable<string>(stored || 'home');

if (browser) {
	lastTab.subscribe((value) => {
		localStorage.setItem('lastTab', value);
	});
}
