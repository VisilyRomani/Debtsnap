import { PUBLIC_VAPID_KEY } from '$env/static/public';
import { set_create_hardware } from './hardware';
export const registerPush = async (user_id: string) => {
	const registration = await navigator.serviceWorker.getRegistration();
	const permission = await registration?.pushManager.permissionState({ userVisibleOnly: true });
	if (registration?.pushManager && permission !== 'denied') {
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: PUBLIC_VAPID_KEY
		});
		const id = set_create_hardware();
		if (subscription.endpoint) {
			await fetch('/api/subscribe', {
				method: 'POST',
				body: JSON.stringify({ subscription, user_id, hardware_id: id })
			});
		} else {
			console.log('missing endpoint');
		}
	} else {
		console.error('Missing registration.pushManager');
	}
};
