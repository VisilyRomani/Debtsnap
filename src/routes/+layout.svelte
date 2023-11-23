<script lang="ts">
	import { onMount } from 'svelte';
	import '../global.css';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	export const ssr = false;
	export const prerender = false;

	onMount(async () => {
		try {
			pb.authStore.isValid && (await pb.collection('users').authRefresh());
		} catch (error) {
			pb.authStore.clear();
		}
		if (!pb.authStore.isValid) {
			goto('/login');
		}
	});
</script>

<slot />
