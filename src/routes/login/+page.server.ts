import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';

const signupValidation = z
	.object({
		name: z.string().min(1, 'Must include name'),
		email: z.string().email(),
		password: z.string().min(8, 'Password need minimum of 8 characters'),
		passwordConfirm: z.string()
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match',
		path: ['passwordConfirm']
	});

export const load = ({ request }) => {
	const signupForm = superValidate(request, signupValidation);
	return { signupForm };
};

export const actions = {
	signup: async ({ request, locals }) => {
		const signupForm = await superValidate(request, signupValidation);

		if (!signupForm.valid) {
			return { signupForm };
		}
		try {
			await locals.server_pb.collection('users').create(signupForm.data);
			return { signupForm };
		} catch (err) {
			if (err instanceof Error) {
				return fail(400, { message: err.message });
			}
		}
		return { signupForm };
	}
};
