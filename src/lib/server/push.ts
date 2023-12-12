import { PRIVATE_VAPID_KEY } from '$env/static/private';
import { PUBLIC_VAPID_KEY } from '$env/static/public';
import webpush from 'web-push';
import type Client from 'pocketbase';
import type { TPush } from '../../routes/api/subscribe/+server';
type TMessageType = 'Debt' | 'Confirm' | 'Friend';

type TSubscription = {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
};

webpush.setVapidDetails('mailto:visilyromanicm@gmail.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

export const pushTest = () => {
	const payload = JSON.stringify({ title: 'test', message: 'test' });
	webpush
		.sendNotification(
			{
				endpoint:
					'https://fcm.googleapis.com/fcm/send/cAMh6RZk3fY:APA91bF8vVBEpNM0gi5Yot1yi2bmJMdpLmja8f2ceuAICMXbj5J5pytkZbduE9-IaWrSB8gHe6ooDGr7PHFu3v93w_W4OXpGGIwywTihPNYjzySkdn8TW-ER_eBeYoEpPdhX3TXKPgl5',
				keys: {
					p256dh:
						'BOJXBH0kpWGRrk0dYHifaW1Se14I1OKN-YtntksAgeTWNTAtFdTp7-vcMexxVB0m6vG__UmpWrB18Ed5Opvf7CY',
					auth: '0R_fxSfryqAytY3NeQsNTw'
				}
			},
			payload
		)
		.catch((error) => {
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

export const pushDebt = (subscriptions: TSubscription[], messageType: TMessageType) => {
	const payload = pushMessage(messageType);
	// const clientDevices = server_pb.collection('push_detail').getList<TPush>(1, 30, {
	// 	filter: `user="${user}"`
	// });

	// clientDevices
	// 	.then((devices) => {
	// 		devices.items.forEach((device) => {
	// 			if (device.endpoint) {
	// 				const subscription = {
	// 					endpoint: device.endpoint,
	// 					keys: {
	// 						p256dh: device.p256dh,
	// 						auth: device.auth
	// 					}
	// 				};
	// 			}
	// 		});
	// 	})
	// 	.catch((e) => console.log(e));
	// webpush.sendNotification(, payload).catch((error) => {
	// 	console.log(error);
	// });
};
