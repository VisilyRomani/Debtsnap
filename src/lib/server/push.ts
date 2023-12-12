import { PRIVATE_VAPID_KEY } from '$env/static/private';
import { PUBLIC_VAPID_KEY } from '$env/static/public';
import webpush, { type PushSubscription } from 'web-push';
import { server_pb } from './server';
import type { TPush } from '../../routes/api/subscribe/+server';
type TMessageType = 'Debt' | 'Confirm' | 'Friend';

webpush.setVapidDetails('mailto:visilyromanicm@gmail.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

export const pushTest = (subscription: PushSubscription) => {
	const payload = JSON.stringify({ title: 'test' });
	webpush.sendNotification(subscription, payload).catch((error) => {
		console.error(error.stack);
	});
};

const pushMessage = (messageType: TMessageType) => {
	if (messageType === 'Debt') {
		return JSON.stringify({ title: 'DebtSnap', message: 'You have a new debt!' });
	} else if (messageType === 'Confirm') {
		return JSON.stringify({ title: 'DebtSnap', message: 'You have a new debt to confirm!' });
	} else if (messageType === 'Friend') {
		return JSON.stringify({ title: 'DebtSnap', message: 'You have a new friend request!' });
	}
};

// export const pushDebt = async (user: string, messageType: TMessageType) => {
// 	const payload = pushMessage(messageType);
// 	try {
// 		const clientDevices = await server_pb.collection('push_detail').getList<TPush>(1, 30, {
// 			filter: `user="${user}"`
// 		});
// 		clientDevices.items.forEach((device) => {
// 			if (device.endpoint) {
// 				const subscription = {
// 					endpoint: device.endpoint,
// 					keys: {
// 						p256dh: device.p256dh,
// 						auth: device.auth
// 					}
// 				};
// 				webpush.sendNotification(subscription, payload).catch((error) => {
// 					console.error(error.stack);
// 				});
// 			}
// 		});
// 	} catch (e) {
// 		console.log(e);
// 	}
// };
