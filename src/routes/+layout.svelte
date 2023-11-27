<script lang="ts">
	import '../global.css';
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { Toaster } from 'svelte-french-toast';
	import Home from '$lib/icons/home.svelte';
	import Friends from '$lib/icons/friends.svelte';
	import Validate from '$lib/icons/validate.svelte';
	import { page } from '$app/stores';

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

{#if !($page.route.id === '/login')}
	<div class="nav_container">
		<div class="content">
			<slot />
		</div>
		<nav class="bottom-nav">
			<a href="/confirm">
				<div class="icon">
					<Validate size={30} />
					Confirm
				</div>
			</a>
			<a href="/dashboard">
				<div class="icon">
					<Home size={30} />
					Dashboard
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
{:else}
	<slot />
{/if}
<Toaster />

<style>
	.icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.content {
		display: flex;
		flex-direction: column;
		overflow: auto;
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
		position: absolute;
		width: 100%;
		display: flex;
		height: 100vh;
		flex-direction: column;
		justify-content: space-between;
	}
	.bottom-nav {
		position: relative;
		bottom: 0;
		width: 100%;
		display: flex;
		gap: 1px;
		padding: 0px 1px 1px 0px;

		background-color: var(--light-accent);
	}
</style>
