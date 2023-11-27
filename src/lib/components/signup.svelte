<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from '../../routes/login/$types';
	export let data: PageData;

	const { form, errors, enhance } = superForm(data.signupForm, {
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				try {
					await pb.collection('users').authWithPassword($form.email, $form.password);
					await goto('/dashboard');
				} catch (e) {
					console.error(e);
				}
			}
		}
	});

	export let isLogin: boolean;
</script>

<div class="container">
	<form class="login-container" action="/login?/signup" use:enhance method="post">
		<div class="header">
			<h2 style="margin: 0;">Create Account</h2>
		</div>
		<div class="input-container">
			<input
				placeholder="Name"
				name="name"
				bind:value={$form.name}
				style={$errors.name && 'border:2px solid rgb(232, 174, 174)'}
			/>
			{#if $errors.name}
				<p class="error-response">{$errors.name}</p>
			{/if}
		</div>
		<div class="input-container">
			<input
				placeholder="Email"
				type="email"
				name="email"
				bind:value={$form.email}
				style={$errors.email && 'border:2px solid rgb(232, 174, 174)'}
			/>
			{#if $errors.email}
				<p class="error-response">{$errors.email}</p>
			{/if}
		</div>
		<div class="input-container">
			<input
				type="password"
				placeholder="Password"
				name="password"
				bind:value={$form.password}
				style={$errors.password && 'border:2px solid rgb(232, 174, 174)'}
			/>
			{#if $errors.password}
				<p class="error-response">{$errors.password}</p>
			{/if}
		</div>
		<div class="input-container">
			<input
				type="password"
				placeholder="Confirm Password"
				name="passwordConfirm"
				bind:value={$form.passwordConfirm}
				style={$errors.passwordConfirm && 'border:2px solid rgb(232, 174, 174)'}
			/>
			{#if $errors.passwordConfirm}
				<p class="error-response">{$errors.passwordConfirm}</p>
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
</style>
