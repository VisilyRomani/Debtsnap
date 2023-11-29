import { error, json } from '@sveltejs/kit';

export const POST = async ({ locals, request }) => {
	const {
		user,
		friend
	}: {
		user: string;
		friend: string;
	} = await request.json();

	try {
		await locals.server_pb
			.collection('users')
			.update(user, { 'friends-': friend }, { requestKey: null });
		await locals.server_pb
			.collection('users')
			.update(friend, { 'friends-': user }, { requestKey: null });
	} catch (e) {
		throw error(404, {
			message: 'Failed to delete friend'
		});
	}
	return json({ message: 'Friend deleted' });
};
