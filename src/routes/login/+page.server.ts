import { fail } from '@sveltejs/kit';

export const actions = {
	signup: async ({ request, locals }) => {
		const formData = await request.formData();
		console.log(formData);
		try {
			await locals.server_pb.collection('users').create(formData);
			return {};
		} catch (err) {
			if (err instanceof Error) {
				return fail(400, { message: err.message });
			}
		}
	}
};
