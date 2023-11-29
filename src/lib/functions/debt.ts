import { pb } from '$lib/pocketbase';

export type TDebtConfirm = {
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

export const getDebtConfirm = (id: string) => {
	return pb.collection('debt_confirm').getFullList<TDebtConfirm>({
		expand: 'debt, debt.debt_from',
		fields:
			'payment_details, id, expand.debt.id, expand.debt.cost, expand.debt.expand.debt_from.name, expand.debt.description',
		filter: `(debt.debt_to="${id}" && debt.status!='completed')`,
		requestKey: null
	});
};

export const getDebtConfirmCount = async (id: string) => {
	return (
		await pb.collection('debt_confirm').getList(1, 1, {
			expand: 'debt',
			filter: `(debt.debt_to="${id}" && debt.status!='completed')`,
			requestKey: null
		})
	).totalItems;
};
