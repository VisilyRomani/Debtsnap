import { fail } from '@sveltejs/kit';
import z from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
export type TUser = { id: string; name: string }[];

const validateFriend = z.object({
	id: z.string().min(1),
	friend_id: z.string().min(1, 'Must Enter Friend Id')
});

export const load = () => {
	const friendForm = superValidate(validateFriend);
	return { friendForm };
};

export const actions = {
	sendFriendRequest: async ({ locals, request }) => {
		const friendForm = await superValidate(request, validateFriend);

		if (!friendForm.valid) {
			return fail(400, { friendForm });
		}

		if (friendForm.data.friend_id === friendForm.data.id) {
			return setError(friendForm, 'friend_id', 'Cannot add yourself as a friend');
		}

		try {
			const isFriend = (
				await locals.server_pb
					.collection('users')
					.getOne<{ friends: string[] }>(friendForm.data.id, { fields: 'friends' })
			).friends.length;

			if (isFriend) {
				return setError(friendForm, 'friend_id', 'User already a friend');
			}

			const isCurrent = await locals.server_pb.collection('friend_request').getList(1, 20, {
				filter: `sender="${friendForm.data.id}" && reciever="${friendForm.data.friend_id}"`,
				requestKey: null
			});
			if (isCurrent.totalItems) {
				return setError(friendForm, 'friend_id', 'Friend Request already sent');
			}

			await locals.server_pb
				.collection('friend_request')
				.create(
					{ sender: friendForm.data.id, reciever: friendForm.data.friend_id },
					{ requestKey: null }
				);
			return { friendForm };
		} catch (err) {
			if (err instanceof Error) {
				console.log(err);
				return setError(friendForm, 'friend_id', 'User not Found');
			}
		}
		return { friendForm };
	}
};
