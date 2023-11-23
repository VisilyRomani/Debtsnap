<script lang="ts">
	import { currentUser, pb } from '../pocketbase';
	let username: string;
	let password: string;

	const login = async () => {
		await pb.collection('users').authWithPassword(username, password);
	};
</script>

{#if !currentUser}
	<form on:submit|preventDefault>
		<input bind:value={username} placeholder="username" />
		<input bind:value={password} placeholder="password" />
	</form>
{/if}
