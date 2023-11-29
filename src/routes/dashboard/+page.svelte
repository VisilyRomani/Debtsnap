<script lang="ts">
	import Add from '$lib/icons/add.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { onDestroy, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import DebtModal from '$lib/components/modal/DebtModal.svelte';
	import PaymentModal from '$lib/components/modal/PaymentModal.svelte';
	import type { TDebt } from './+page.server';

	let isActive = true;
	let debts: TDebt[] = [];
	let newDebtModal = false;
	let payDebtModal = false;
	let timeout: ReturnType<typeof setTimeout>;
	let selectedDebt: string;
	export let data: PageData;

	onMount(async () => {
		debts = await getAllDebt();
	});

	onDestroy(() => {
		pb.collection('debts').unsubscribe();
		clearTimeout(timeout);
	});

	const getAllDebt = (): Promise<TDebt[]> => {
		return pb.collection('debt').getFullList({
			expand: 'debt_from, debt_to, debt_confirm(debt)',
			sort: '-created',
			fields:
				'id, cost, created, description, status, expand.debt_from.name, expand.debt_from.id, expand.debt_to.name,expand.debt_to.username,expand.debt_from.username, expand.debt_to.id, expand.debt_confirm(debt).payment_details'
		});
	};

	pb.collection('debt').subscribe('*', async () => {
		debts = await getAllDebt();
	});

	$: sortedDebts = (debts ?? []).filter((d) =>
		isActive ? d.status !== 'completed' : d.status === 'completed'
	);

	$: amountOwed =
		(debts ?? [])
			?.filter((d) => !(d.status === 'completed'))
			.reduce((acc, cur) => {
				return acc + (cur.expand.debt_to.id !== $currentUser?.id ? cur.cost : 0);
			}, 0) ?? 0;

	const statusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'border-left: 4px green solid;';
			case 'requested':
				return 'border-left: 4px red solid';
			case 'pending':
				return 'border-left: 4px orange solid;';
			default:
				return 'border-left: 4px gray solid;';
		}
	};
</script>

<!-- Main body -->

<div class="total-container">
	<div class="amount-header">
		<h2>Total Amount You Owe</h2>
		<h1>${(amountOwed / 100).toFixed(2)}</h1>
	</div>
</div>
<div class="tab-select">
	<button
		class="tab-button"
		style={isActive ? 'border-bottom:2px solid var(--dark-text)' : ''}
		on:click={() => (isActive = true)}>Active</button
	>
	<button
		class="tab-button"
		style={!isActive ? 'border-bottom:2px solid var(--dark-text)' : ''}
		on:click={() => (isActive = false)}>Completed</button
	>
</div>
<div class="debt-container">
	{#each sortedDebts ?? [] as debt, idx (idx)}
		<div
			in:fly|global={{ y: 100, duration: 500, delay: idx * 150 + 101 }}
			class="friend"
			style={debt.expand.debt_to.id === $currentUser?.id
				? 'border-left: 4px blue solid;'
				: statusColor(debt.status)}
		>
			{#if debt.expand.debt_to.id === $currentUser?.id}
				<div style="display: flex; align-items: center; gap: 0.5em;">
					<img
						class="avatar"
						alt="avatar"
						width="50px"
						src="https://api.dicebear.com/7.x/bottts/svg?seed={debt.expand.debt_from.username}"
					/>
					<div style="display: flex; flex-direction: column;">
						<h3>${(debt.cost / 100).toFixed(2)}</h3>
						<small>
							From:
							{debt.expand.debt_from.name}
						</small>
						<small>
							Description: {debt.description}
						</small>
					</div>
				</div>
			{:else}
				<div style="display: flex; align-items: center; gap: 0.5em;">
					<img
						class="avatar"
						alt="avatar"
						width="50px"
						src="https://api.dicebear.com/7.x/bottts/svg?seed={debt.expand.debt_to.username}"
					/>
					<div style="display: flex; flex-direction: column;">
						<h3>${(debt.cost / 100).toFixed(2)}</h3>
						<small>
							To:
							{debt.expand.debt_to.name}
						</small>
						<small>
							Description: {debt.description}
						</small>
						{#if debt.status === 'completed'}
							<small>
								Payment: {debt.expand['debt_confirm(debt)'][0].payment_details}
							</small>
						{/if}
					</div>
				</div>
			{/if}
			<div class="pay">
				{#if debt.status === 'completed'}
					<h3>Resolved</h3>
				{:else if debt.status == 'pending'}
					<h3>Pending</h3>
				{:else if !(debt.expand.debt_to.id === $currentUser?.id)}
					<button
						type="button"
						on:click={() => {
							selectedDebt = debt.id;
							payDebtModal = true;
						}}>Pay</button
					>
				{/if}
				{new Date(debt.created).toDateString()}
			</div>
		</div>
	{/each}
</div>

<div class="add">
	<button type="button" style="all:unset;" name="add debt" on:click={() => (newDebtModal = true)}>
		<Add size={50} />
	</button>
</div>

<DebtModal bind:data bind:newDebtModal />
<PaymentModal bind:data {selectedDebt} bind:payDebtModal />

<style>
	.tab-select {
		display: flex;
		padding: 1em;
		gap: 1em;
	}

	.tab-button {
		background-color: inherit;
		color: var(--dark-text);
		font-weight: bold;
		border-radius: 0;
	}
	/* Main Dashboard  */
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
		padding: 1em;
		gap: 0.5em;
	}
	.debt-container {
		width: 100%;
		flex: 1 1 auto;
		overflow-y: auto;
	}
	.friend {
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
