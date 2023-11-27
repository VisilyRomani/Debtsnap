<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import { getFriends } from '$lib/functions/friend';
	import Add from '$lib/icons/add.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { TUser } from '../profile/+page.server';
	let showModal = false;

	type TDebt = {
		cost: number;
		created: Date;
		name: string;
		resolved: boolean;
		expand: {
			debt_from: {
				name: string;
				id: string;
			};
			debt_to: {
				name: string;
				id: string;
			};
		};
	};

	let debts: TDebt[] = [];
	let friends: TUser = [];

	onMount(async () => {
		debts = await getAllDebt();
		friends = await getFriends($currentUser?.id ?? '');
	});

	onDestroy(() => {
		pb.collection('debts').unsubscribe();
	});

	const getAllDebt = (): Promise<TDebt[]> => {
		return pb.collection('debt').getFullList({
			expand: 'debt_from, debt_to',
			sort: '-created',
			fields:
				'cost, created, name, resolved, expand.debt_from.name,expand.debt_from.id,expand.debt_to.name,expand.debt_to.id'
		});
	};

	pb.collection('debt').subscribe('*', async () => {
		debts = await getAllDebt();
	});

	$: sortedDebts = debts?.sort((a, b) => (a.resolved === b.resolved ? 0 : a.resolved ? 1 : -1));
	$: amountOwed =
		debts
			?.filter((d) => !d.resolved)
			.reduce((acc, cur) => {
				return acc + (cur.expand.debt_to.id !== $currentUser?.id ? cur.cost : 0);
			}, 0) ?? 0;
</script>

<!-- Main body -->
<div class="total-container">
	<div class="amount-header">
		<h4>Total Amount You Owe</h4>
		<h2>${(amountOwed / 100).toFixed(2)}</h2>
	</div>
</div>
<div class="friend-container">
	{#each sortedDebts as debt, idx (idx)}
		<div
			transition:fly={{ y: 100, duration: 500, delay: idx * 150 }}
			class="friend"
			style={debt.resolved
				? 'border-left: 4px gray solid;'
				: debt.expand.debt_to.id === $currentUser?.id
				  ? 'border-left: 4px rgb(95, 224, 149) solid;'
				  : 'border-left: 4px red solid;'}
		>
			{#if debt.expand.debt_to.id === $currentUser?.id}
				<div style="display: flex; align-items: center; gap: 0.5em;">
					<img
						class="avatar"
						alt="avatar"
						width="50px"
						src="https://api.dicebear.com/7.x/bottts/svg?seed={debt.expand.debt_to.id}"
					/>
					<div style="display: flex; flex-direction: column;">
						<h3>${(debt.cost / 100).toFixed(2)}</h3>
						<small>
							From:
							{debt.expand.debt_from.name}
						</small>
					</div>
				</div>
			{:else}
				<div style="display: flex; align-items: center; gap: 0.5em;">
					<img
						class="avatar"
						alt="avatar"
						width="50px"
						src="https://api.dicebear.com/7.x/bottts/svg?seed={debt.expand.debt_to.id}"
					/>
					<div style="display: flex; flex-direction: column;">
						<h3>${(debt.cost / 100).toFixed(2)}</h3>
						<small>
							To:
							{debt.expand.debt_to.name}
						</small>
					</div>
				</div>
			{/if}
			<div class="pay">
				{#if debt.resolved}
					<h3>Resolved</h3>
				{:else if !(debt.expand.debt_to.id === $currentUser?.id)}
					<button>Pay</button>
				{/if}
				{new Date(debt.created).toDateString()}
			</div>
		</div>
	{/each}
</div>

<Modal bind:showModal>
	<div>
		<h3>Add New Debt</h3>
	</div>
</Modal>

<div class="add">
	<button style="all:unset;" on:click={() => (showModal = true)}>
		<Add size={50} />
	</button>
</div>

<style>
	.pay {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.amount-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2em;
	}
	.friend-container {
		width: 100%;
		flex: 1 1 auto;
		overflow-y: auto;
	}
	.friend {
		/* display: grid; */
		/* grid-template-columns: repeat(2, 1fr); */
		display: flex;
		justify-content: space-between;
		background-color: var(--main-bg-color);
		box-shadow: 0px 0px 5px 1px rgba(189, 189, 189, 0.527);
		border-radius: 0.5em;
		padding: 1em;
		margin: 1em;
	}
	.total-container {
		width: 100%;
		flex: 0 0 auto;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--light-accent);
		background-size: 1000% 1000%;
		border-radius: 0 0 2em 2em;
	}
</style>
