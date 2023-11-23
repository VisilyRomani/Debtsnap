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
	addFriend: async ({ locals, request }) => {
		const friendForm = await superValidate(request, validateFriend);

		if (!friendForm.valid) {
			return fail(400, { friendForm });
		}

		try {
			await locals.server_pb
				.collection('friend_request')
				.create({ sender: friendForm.data.id, reciever: friendForm.data.friend_id });
			return { friendForm };
		} catch (err) {
			if (err instanceof Error) {
				return setError(friendForm, 'friend_id', 'User not Found');
			}
		}
		return { friendForm };
	}
};
