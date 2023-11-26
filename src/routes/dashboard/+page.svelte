<script lang="ts">
	import Add from '$lib/icons/add.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	let showModal = false;

	type TClient = {
		expand: {
			friends: {
				id: string;
				name: string;
			}[];
		};
	};

	let client: TClient;
	// pb.collection('debt').getFullList;
	onMount(async () => {
		client = await pb.collection('users').getOne<TClient>($currentUser?.id ?? '', {
			expand: 'friends, debt(debt_from)'
			// fields: 'expand.(debt),expand.friends.name,expand.friends.id'
		});
		const debts = await pb.collection('debt').getFullList({ expand: 'debt_from, debt_to' });
		console.log(client);
	});
</script>

<div style="height: 100%; max-width:100%; overflow:auto">
	<!-- Main body -->
	<div class="total-container">
		<div class="amount-header">
			<h4>Total Amount Owed</h4>
			<h2>$123.23</h2>
		</div>
	</div>
	<div class="friend-container">
		{#each client?.expand.friends ?? [] as friend}
			<div class="friend">
				<div style="display: flex; align-items: center; gap: 0.5em;">
					<img
						class="avatar"
						alt="avatar"
						width="50px"
						src="https://api.dicebear.com/7.x/bottts/svg?seed={$currentUser?.id}"
					/>
					<div style="display: flex; flex-direction: column;">
						<h3>$40</h3>
						<small>
							{friend.name}
						</small>
					</div>
				</div>
				<div>
					<button>Pay</button>
					{new Date().toDateString()}
				</div>
			</div>
		{/each}
	</div>
</div>

<div class="add">
	<button style="all:unset;" on:click={() => (showModal = true)}>
		<Add size={50} />
	</button>
</div>

<style>
	.amount-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2em;
	}
	.friend-container {
		width: 100%;
		box-sizing: border-box;
	}
	.friend {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		background-color: var(--main-bg-color);
		box-shadow: 0px 0px 5px 1px rgba(189, 189, 189, 0.527);
		border-radius: 0.5em;
		border-left: 4px rgb(95, 224, 149) solid;
		padding: 1em;
		margin: 1em;
	}
	.total-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--light-accent);
		background-size: 1000% 1000%;
		border-radius: 0 0 2em 2em;
	}
</style>
