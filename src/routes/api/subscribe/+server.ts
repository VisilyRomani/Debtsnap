import type { PushSubscription } from 'web-push';
import { json } from '@sveltejs/kit';

export type TPush = {
	id: string;
	user: string;
	endpoint: string;
	p256dh: string;
	auth: string;
	hardware_id: string;
};

export const POST = async ({ locals, request }) => {
	const {
		subscription,
		hardware_id,
		user_id
	}: { user_id: string; subscription: PushSubscription; hardware_id: string } =
		await request.json();

	try {
		await locals.server_pb.collection('push_detail').create(
			{
				endpoint: subscription.endpoint,
				p256dh: subscription.keys.p256dh,
				auth: subscription.keys.auth,
				hardware_id: hardware_id,
				user: user_id
			},
			{ requestKey: null }
		);
	} catch (e) {
		const subscriptionData = await locals.server_pb
			.collection('push_detail')
			.getFirstListItem<TPush>(`user="${user_id}" && hardware_id="${hardware_id}"`, {
				requestKey: null
			});

		// check if any data changed for push subscription device
		if (
			subscriptionData.auth !== subscription.keys.auth ||
			subscriptionData.p256dh !== subscription.keys.p256dh ||
			subscriptionData.endpoint !== subscription.endpoint
		) {
			await locals.server_pb.collection('push_detail').update(
				subscriptionData.id,
				{
					endpoint: subscription.endpoint,
					p256dh: subscription.keys.p256dh,
					auth: subscription.keys.auth
				},
				{ requestKey: null }
			);
		}
	}
	return json({ message: 'Push Sent' });
};
