<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import { onDestroy, onMount } from 'svelte';

	type TDebtConfirm = {
		id: string;
		payment_details: string;
		expand: {
			debt: {
				cost: number;
				description: string;
				id: string;
				expand: {
					debt_from: {
						name: string;
					};
				};
			};
		};
	};
	let debt_confirms: TDebtConfirm[] = [];

	onMount(async () => {
		debt_confirms = await getDebtConfirm();
	});

	onDestroy(() => {
		pb.collection('debt_confirm').unsubscribe();
	});

	pb.collection('debt_confirm').subscribe('*', async () => {
		debt_confirms = await getDebtConfirm();
	});
	const getDebtConfirm = () => {
		return pb.collection('debt_confirm').getFullList<TDebtConfirm>({
			expand: 'debt, debt.debt_from',
			fields:
				'payment_details, id, expand.debt.id, expand.debt.cost, expand.debt.expand.debt_from.name, expand.debt.description',
			filter: `(debt.debt_to="${$currentUser?.id}" && debt.status!='completed')`
		});
	};

	const requestReponse = async ({
		id,
		accept,
		debt_id
	}: {
		id: string;
		accept: boolean;
		debt_id: string;
	}) => {
		await fetch('/api/confirmDebt', {
			method: 'post',
			body: JSON.stringify({ id, debt_id, accept })
		});
		debt_confirms = await getDebtConfirm();
	};
</script>

<div class="header-container">
	<h1>Debt Confirmation</h1>
</div>

{#if !debt_confirms.length}
	<div class="full-screen">
		<h3>
			Nothing to confirm
			<span class="dot">.</span>
			<span class="dot">.</span>
			<span class="dot">.</span>
		</h3>
	</div>
{/if}

<div class="confirm-container">
	{#each debt_confirms as confirm}
		<div class="confirm">
			<h2>
				{confirm.expand.debt.expand.debt_from.name}
			</h2>

			<div style="display: flex; justify-content:space-between; align-items:center;">
				<h3>Payment:</h3>
				<small>
					{confirm.payment_details}
				</small>
			</div>

			<div style="display: flex; justify-content:space-between; align-items:center;">
				<h3>For</h3>
				<small>
					{confirm.expand.debt.description} - ${(confirm.expand.debt.cost / 100).toFixed(2)}
				</small>
			</div>

			<div style="display:flex; gap:1em;font-size: 1.2em; ">
				<button
					type="button"
					on:click={() =>
						requestReponse({ id: confirm.id, debt_id: confirm.expand.debt.id, accept: false })}
					>Decline</button
				>
				<button
					type="button"
					on:click={() =>
						requestReponse({ id: confirm.id, debt_id: confirm.expand.debt.id, accept: true })}
					>Accept</button
				>
			</div>
		</div>
	{/each}
</div>

<style>
	.header-container {
		padding-top: 1em;
		text-align: center;
		flex: 0 0 auto;
	}
	.confirm {
		border-left: 8px solid var(--dark-accent);
		display: flex;
		flex-direction: column;
		box-shadow: 0px 0px 5px 1px rgba(189, 189, 189, 0.527);
		padding: 1em;
		justify-content: space-between;
		gap: 0.5em;
		text-align: center;
		margin: 1em;
		border-radius: 0.5em;
	}
	.confirm-container {
		overflow-y: auto;
		flex: 1 1 auto;
	}
</style>
