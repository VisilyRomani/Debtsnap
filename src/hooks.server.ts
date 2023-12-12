import { server_pb } from '$lib/server/server';
// import { pushDebt } from '$lib/server/push';

export const handle = async ({ event, resolve }) => {
	event.locals.server_pb = server_pb;
	// event.locals.pushDebt = pushDebt;
	const response = await resolve(event);
	return response;
};
