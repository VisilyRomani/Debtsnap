<script lang="ts">
	import { onMount } from 'svelte';
	import '../global.css';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import Home from '$lib/icons/home.svelte';
	import Friends from '$lib/icons/friends.svelte';

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

<div class="nav_container">
	<div class="content">
		<slot />
	</div>
	<nav class="bottom-nav">
		<a href="/">
			<div class="icon">
				<Home size={30} />
				Home
			</div>
		</a>
		<a href="/profile">
			<div class="icon">
				<Friends size={30} />
				Profile
			</div>
		</a>
	</nav>
</div>

<style>
	.icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.content {
		height: 100%;
	}
	a {
		text-align: center;
		border-radius: 0.3em;
		padding: 0.5em;
		color: var(--dark-text);
		width: 100%;
		fill: var(--dark-text);
	}
	a:hover {
		color: var(--light-text);
		fill: var(--light-text);
	}

	.nav_container {
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: space-between;
	}
	.bottom-nav {
		display: flex;
		gap: 1px;
		padding: 0px 1px 1px 0px;

		background-color: var(--light-accent);
	}
</style>
