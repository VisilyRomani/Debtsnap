<script lang="ts">
	import { ClientResponseError } from 'pocketbase';
	import { pb } from '../pocketbase';
	import { goto } from '$app/navigation';
	let username: string;
	let password: string;
	export let isLogin: boolean;
	let inputError:
		| {
				identity: { code: string; message: string };
				password: { code: string; message: string };
		  }
		| undefined;
	let loginError: string | undefined;
	const login = async () => {
		try {
			if (!username || !password) {
				loginError = 'Fields are required';
				return;
			}
			await pb.collection('users').authWithPassword(username.toLocaleLowerCase(), password);
			goto('/dashboard');
		} catch (error) {
			if (error instanceof ClientResponseError) {
				if (!!Object.keys(error.data)) {
					loginError = error.response.message;
				} else {
					inputError = error.response.data;
				}
			}
		}
	};
</script>

<div class="container">
	<form on:submit|preventDefault={login} class="login-container">
		<div style="text-align:center;">
			<h1 style="margin: 0;">Welcome 🤟</h1>
			<h4 style="margin: 0;">Login to DebtSnap</h4>
		</div>
		<div class="input-container">
			<input
				bind:value={username}
				placeholder="Username"
				style={(loginError || loginError) && 'border:2px solid rgb(232, 174, 174)'}
				on:focus={() => {
					inputError = undefined;
					loginError = undefined;
				}}
			/>
			{#if !!inputError?.identity || !!loginError}
				<p class="error-response">{loginError || inputError?.identity.message}</p>
			{/if}
		</div>
		<div class="input-container">
			<input bind:value={password} type="password" placeholder="Password" />
			{#if !!inputError?.password}
				<p class="error-response">{inputError?.password.message}</p>
			{/if}
		</div>
		<button>LOG IN</button>
		<p>
			Don't have an account?
			<span>
				<button class="signup" on:click={() => (isLogin = false)}>Sign Up</button>
			</span>
		</p>
	</form>
</div>

<style>
	.input-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 0.5em;
	}
	.container {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1em;
		/* padding: 0.5em; */
	}
	.signup {
		all: unset;
	}
	.signup:hover {
		color: var(--light-text);
	}
	.error-response {
		color: rgb(175, 56, 56);
		background-color: rgb(232, 174, 174);
		padding: 0.2em;
		margin: 0;
		border-radius: 0.4em;
	}
</style>
