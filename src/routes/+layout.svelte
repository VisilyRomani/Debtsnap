<script lang="ts">
	import '../global.css';
	import { onDestroy, onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { Toaster } from 'svelte-french-toast';
	import Home from '$lib/icons/home.svelte';
	import Friends from '$lib/icons/friends.svelte';
	import Validate from '$lib/icons/validate.svelte';
	import { page } from '$app/stores';
	import { getDebtConfirmCount } from '$lib/functions/debt';

	$: confirmCount = 0;

	onMount(async () => {
		try {
			if (pb.authStore.isValid) {
				await pb.collection('users').authRefresh();
			} else {
				pb.authStore.clear();
				goto('/login');
			}
		} catch (error) {
			pb.authStore.clear();
			goto('/login');
		}

		await updateConfirmCount();
	});

	onDestroy(() => {
		pb.collection('debt_confirm').unsubscribe();
	});

	const updateConfirmCount = async () => {
		confirmCount = await getDebtConfirmCount($currentUser?.id ?? '');
	};

	$: $currentUser?.id && updateConfirmCount();

	pb.collection('debt_confirm').subscribe('*', async () => {
		updateConfirmCount();
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
					<div class="validate">
						<Validate size={30} />
						{#if confirmCount}
							<span id="confirm-count">{confirmCount}</span>
						{/if}
					</div>
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
	.validate {
		position: relative;
	}
	#confirm-count {
		position: absolute;
		top: 0px;
		right: -5px;
		line-height: 15px;
		height: 15px;
		width: 15px;
		font-size: 10px;
		text-align: center;
		color: white;
		border-radius: 100%;
		background-color: rgb(255, 60, 60);
	}

	.icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.content {
		display: flex;
		flex-direction: column;
		overflow: auto;
		position: relative;
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
	a:hover #confirm-count {
		background-color: rgb(255, 160, 160);
	}

	.nav_container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
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
