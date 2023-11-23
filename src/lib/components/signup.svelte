<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';

	export let isLogin: boolean;
	let inputError:
		| {
				identity: { code: string; message: string };
				password: { code: string; message: string };
		  }
		| undefined;
	let loginError: string | undefined;
</script>

<div class="container">
	<form
		class="login-container"
		action="/login?/signup"
		use:enhance={({ formData }) => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					const email = String(formData.get('email'));
					const pass = String(formData.get('password'));
					await pb.collection('users').authWithPassword(email, pass);
					goto('/');
				}
			};
		}}
		method="post"
	>
		<div class="header">
			<h2 style="margin: 0;">Create Account</h2>
		</div>
		<div class="input-container">
			<input placeholder="Name" name="name" />
			{#if !!inputError?.identity || !!loginError}
				<p class="error-response">{loginError || inputError?.identity.message}</p>
			{/if}
		</div>
		<div class="input-container">
			<input placeholder="Email" type="email" name="email" />
			{#if !!inputError?.identity || !!loginError}
				<p class="error-response">{loginError || inputError?.identity.message}</p>
			{/if}
		</div>
		<div class="input-container">
			<input type="password" placeholder="Password" name="password" />
			{#if !!inputError?.password}
				<p class="error-response">{inputError?.password.message}</p>
			{/if}
		</div>
		<div class="input-container">
			<input type="password" placeholder="Confirm Password" name="passwordConfirm" />
			{#if !!inputError?.password}
				<p class="error-response">{inputError?.password.message}</p>
			{/if}
		</div>
		<button type="submit">Sign Up</button>
		<p>
			Already have an account?
			<span>
				<button class="signup" on:click={() => (isLogin = true)}>Sign In</button>
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
