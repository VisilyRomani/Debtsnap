import { goto } from '$app/navigation';
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

type TUser =
	| {
			id: string;
			name: string;
			email: string;
			username: string;
	  }
	| undefined;

export const pb = new PocketBase('https://svelte-debt.fly.dev');
export const currentUser = writable<TUser>((pb.authStore.model as TUser) ?? undefined);

pb.authStore.onChange(() => {
	if (!pb.authStore.isValid) {
		goto('/login');
	}
	currentUser.set((pb.authStore.model as TUser) ?? undefined);
});
