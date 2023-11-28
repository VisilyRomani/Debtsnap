<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from '../../../routes/dashboard/$types';
	import type { TDebt } from '../../../routes/dashboard/+page.server';
	import Modal from './Modal.svelte';
	import toast from 'svelte-french-toast';

	export let data: PageData;
	export let payDebtModal = false;
	export let selectedDebt: string;

	$: payDebtModal && reset();

	const { form, errors, enhance, reset } = superForm(data.paymentForm, {
		taintedMessage: null,
		resetForm: true,
		onSubmit: ({ formData }) => {
			formData.set('debt_id', selectedDebt);
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Successfuly created payment request');
				payDebtModal = false;
			}
		}
	});
</script>

<Modal bind:showModal={payDebtModal}>
	<form action="/dashboard?/paymentRequest" method="post" use:enhance>
		<h3>Payment Request</h3>
		<textarea
			bind:value={$form.payment_details}
			name="payment_details"
			placeholder="Enter payment details..."
		/>
		{#if $errors.payment_details}
			<p class="error-response">{$errors.payment_details}</p>
		{/if}
		<button> submit </button>
	</form>
</Modal>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
</style>
