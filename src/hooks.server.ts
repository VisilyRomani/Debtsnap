import { server_pb } from '$lib/server/server';

export const handle = async ({ event, resolve }) => {
	event.locals.server_pb = server_pb;
	const response = await resolve(event);
	return response;
};
