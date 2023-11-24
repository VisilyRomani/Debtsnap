<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { fly } from 'svelte/transition';
	export let requests: { name: string; id: string; sender_id: string }[] = [];

	const requestReponse = async ({
		id,
		accept,
		sender,
		reciever
	}: {
		id: string;
		accept: boolean;
		sender: string;
		reciever: string;
	}) => {
		const reponse = await fetch('/api/accept', {
			method: 'post',
			body: JSON.stringify({ id, accept, sender, reciever })
		});
		console.log(reponse);
	};
</script>

<div class="friends">
	{#each requests as request, idx (idx)}
		<div class="header" transition:fly={{ y: 100, duration: 500, delay: idx * 150 }}>
			<div style="display:flex;">
				<img
					alt="avatar"
					width="50px"
					src="https://api.dicebear.com/7.x/bottts/svg?seed={request?.sender_id}"
				/>
				<div class="name">
					<h3>{request.name}</h3>
				</div>
			</div>
			<div class="button-group">
				<button
					on:click={() =>
						requestReponse({
							id: request.id,
							accept: true,
							sender: request.sender_id,
							reciever: String($currentUser?.id)
						})}>Accept</button
				>
				<button
					on:click={() =>
						requestReponse({
							id: request.id,
							accept: false,
							sender: request.sender_id,
							reciever: String($currentUser?.id)
						})}>Deny</button
				>
			</div>
		</div>
	{/each}
</div>

<style>
	.button-group {
		display: flex;
		gap: 0.5em;
	}
	.friends {
		width: 100%;
	}
	.header {
		margin: 0.5em;
		width: 100%;
		display: flex;
		text-align: center;
		gap: 1em;
		justify-content: space-between;
	}
	.name {
		display: flex;
		flex-direction: column;
		align-items: baseline;
		justify-content: center;
	}
</style>
