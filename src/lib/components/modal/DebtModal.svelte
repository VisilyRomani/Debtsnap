<script lang="ts">
	import Modal from './Modal.svelte';
	import toast from 'svelte-french-toast';
	import { superForm } from 'sveltekit-superforms/client';
	import { currentUser } from '$lib/pocketbase';
	import type { TUser } from '../../../routes/profile/+page.server';
	import type { PageData } from '../../../routes/dashboard/$types';

	export let data: PageData;
	export let newDebtModal = false;
	export let friends: TUser;

	const { form, errors, enhance } = superForm(data.debtForm, {
		taintedMessage: null,
		resetForm: true,
		onSubmit: ({ formData }) => {
			formData.set('debt_to', String($currentUser?.id));
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Debt Sent');
				newDebtModal = false;
			}
		}
	});
</script>

<Modal bind:showModal={newDebtModal}>
	<div>
		<h3>Add New Debt</h3>
		<form class="debt-container" use:enhance method="post" action="/dashboard?/newDebt">
			{#if $errors.debt_to}
				<p class="error-response">{$errors.debt_to}</p>
			{/if}
			<input type="hidden" name="debt_to" />
			<div>
				<input
					placeholder="Description"
					autocomplete="off"
					name="description"
					style={$errors.description && 'border:2px solid rgb(232, 174, 174)'}
					bind:value={$form.description}
				/>
				{#if $errors.description}
					<p class="error-response">{$errors.description}</p>
				{/if}
			</div>
			<div>
				<select
					name="debt_from"
					bind:value={$form.debt_from}
					style={$errors.debt_from && 'border:2px solid rgb(232, 174, 174)'}
				>
					<option value="" selected disabled hidden>Select Friend</option>
					{#each friends as friend}
						<option value={friend.id}>{friend.name}</option>
					{/each}
				</select>
				{#if $errors.debt_from}
					<p class="error-response">{$errors.debt_from}</p>
				{/if}
			</div>
			<div>
				<input
					name="cost"
					type="number"
					step="0.01"
					placeholder="Amount Owed"
					bind:value={$form.cost}
					style={$errors.cost && 'border:2px solid rgb(232, 174, 174)'}
				/>
				{#if $errors.cost}
					<p class="error-response">{$errors.cost}</p>
				{/if}
			</div>
			<button>Submit</button>
		</form>
	</div>
</Modal>

<style>
	.debt-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
</style>
