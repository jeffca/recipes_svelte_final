import { writable } from 'svelte/store';
export const claims = writable(null);
export const authToken = writable(null);
export const groceryListCount = writable(0);