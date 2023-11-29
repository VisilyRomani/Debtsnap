import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

export type TDebt = {
	cost: number;
	created: Date;
	id: string;
	description: string;
	status: 'pending' | 'requested' | 'completed';
	expand: {
		'debt_confirm(debt)': { payment_details: string }[];
		debt_from: {
			name: string;
			username: string;
			id: string;
		};
		debt_to: {
			name: string;
			username: string;
			id: string;
		};
	};
};

const paymentValidation = z.object({
	debt_id: z.string(),
	payment_details: z.string().min(1, 'Must enter payment details')
});

const debtValidation = z.object({
	description: z.string().min(1, 'Debt needs description'),
	debt_to: z.string().min(1, 'Error Missing User'),
	debt_from: z.string().min(1, 'Must select Friend '),
	cost: z.number({ invalid_type_error: 'Must enter cost' }).default('' as unknown as number)
});

export const load = ({ request }) => {
	const debtForm = superValidate(request, debtValidation);
	const paymentForm = superValidate(request, paymentValidation);

	return { debtForm, paymentForm };
};

export const actions = {
	newDebt: async ({ request, locals }) => {
		const debtForm = await superValidate(request, debtValidation);
		if (!debtForm.valid) {
			return fail(400, { debtForm });
		}

		try {
			await locals.server_pb
				.collection('debt')
				.create(
					{ ...debtForm.data, cost: (debtForm.data.cost * 100).toFixed(0), status: 'requested' },
					{ requestKey: null }
				);
		} catch (e) {
			if (e instanceof Error) return setError(debtForm, 'debt_to', e.message);
		}
		return { debtForm };
	},
	paymentRequest: async ({ request, locals }) => {
		const paymentForm = await superValidate(request, paymentValidation);
		if (!paymentForm.valid) {
			return fail(400, { paymentForm });
		}

		try {
			await locals.server_pb.collection('debt_confirm').create(
				{
					debt: paymentForm.data.debt_id,
					payment_details: paymentForm.data.payment_details
				},
				{ requestKey: null }
			);

			await locals.server_pb
				.collection('debt')
				.update(paymentForm.data.debt_id, { status: 'pending' });
		} catch (e) {
			if (e instanceof Error) {
				return setError(paymentForm, 'payment_details', e.message);
			}
		}
		return { paymentForm };
	}
};
