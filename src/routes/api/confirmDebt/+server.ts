import { json } from '@sveltejs/kit';

export const POST = async ({ locals, request }) => {
	const {
		id,
		accept,
		debt_id
	}: {
		accept: boolean;
		debt_id: string;
		id: string;
	} = await request.json();

	try {
		await locals.server_pb
			.collection('debt')
			.update(debt_id, { status: accept ? 'completed' : 'requested' }, { requestKey: null });

		if (!accept) {
			await locals.server_pb.collection('debt_confirm').delete(id, { requestKey: null });
		}
	} catch (e) {
		return json({ message: 'Failed to Delete Request' });
	}
	return json({ message: 'Request Resolved' });
};
