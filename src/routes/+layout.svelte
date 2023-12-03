<script lang="ts">
	import '../global.css';
	import { onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { Toaster } from 'svelte-french-toast';
	import Home from '$lib/icons/home.svelte';
	import Friends from '$lib/icons/friends.svelte';
	import Validate from '$lib/icons/validate.svelte';
	import { page } from '$app/stores';
	import { getDebtConfirmCount } from '$lib/functions/debt';
	import { confirmCount } from '$lib/confirm';
	import Logo from '$lib/icons/logo.svelte';

	onMount(async () => {
		await updateConfirmCount();
	});

	const checkRoute = async (id: string) => {
		if (id === '/') {
			return;
		} else if (id !== '/login') {
			try {
				if (pb.authStore.isValid) {
					await pb.collection('users').authRefresh();
				} else {
					pb.authStore.clear();
					await goto('/login');
				}
			} catch (error) {
				pb.authStore.clear();
				await goto('/login');
			}
		}
	};

	$: checkRoute($page.route?.id ?? '');

	const updateConfirmCount = async () => {
		confirmCount.set(await getDebtConfirmCount($currentUser?.id ?? ''));
	};

	$: $currentUser?.id && updateConfirmCount();
</script>

{#if $page.route.id === '/'}
	<div class="landing">
		<nav class="landing-nav">
			<div class="logo-header">
				<Logo size={50} />
			</div>

			<div>
				<a id="landing-login" href="/login" style="padding: .7em; font-size: large;">Login</a>
			</div>
		</nav>
		<slot />
	</div>
{:else if $page.route.id === '/login'}
	<slot />
{:else}
	<div class="nav_container">
		<div class="content">
			<slot />
		</div>
		<nav class="bottom-nav">
			<a href="/confirm" class="mobile">
				<div class="icon">
					<div class="validate">
						<Validate size={30} />
						{#if $confirmCount}
							<span id="confirm-count">{$confirmCount}</span>
						{/if}
					</div>
					Confirm
				</div>
			</a>
			<a href="/dashboard" class="mobile">
				<div class="icon">
					<Home size={30} />
					Dashboard
				</div>
			</a>
			<a href="/profile" class="mobile">
				<div class="icon">
					<Friends size={30} />
					Profile
				</div>
			</a>
		</nav>
	</div>
{/if}
<Toaster />

<style>
	.landing {
		height: 100%;
		overflow: auto;
	}
	.landing-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1em;
		background-color: var(--light-accent);
	}

	#landing-login {
		background-color: var(--dark-text);
		color: var(--main-bg-color);
		font-size: xx-large;
		border-radius: 2em;
		box-shadow: 0px 0px 5px 0px rgb(112, 112, 112);
		transition: all 0.5s;
	}
	#landing-login:hover {
		box-shadow: 0px 5px 7px 1px rgba(48, 66, 49, 0.147);
	}

	.logo-header {
		font-size: 1.5em;
		gap: 0.5em;
		display: flex;
		align-items: center;
	}

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
	.mobile {
		text-align: center;
		border-radius: 0.3em;
		padding: 0.5em;
		color: var(--dark-text);
		width: 100%;
		fill: var(--dark-text);
	}
	.mobile:hover {
		color: var(--light-text);
		fill: var(--light-text);
	}
	.mobile:hover #confirm-count {
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
