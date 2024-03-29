import { json } from '@sveltejs/kit';

export const POST = async ({ locals, request }) => {
	const {
		accept,
		sender,
		reciever,
		id
	}: {
		accept: boolean;
		sender: string;
		reciever: string;
		id: string;
	} = await request.json();

	try {
		if (accept) {
			await locals.server_pb
				.collection('users')
				.update(sender, { 'friends+': reciever }, { requestKey: null });
			await locals.server_pb
				.collection('users')
				.update(reciever, { 'friends+': sender }, { requestKey: null });
		}
		await locals.server_pb.collection('friend_request').delete(id, { requestKey: null });
	} catch (e) {
		return json({ message: 'Failed to Delete Request' });
	}
	return json({ message: 'Request Resolved' });
};
