import { writable } from 'svelte/store';

export const isLoggedin = writable<boolean>(false);
