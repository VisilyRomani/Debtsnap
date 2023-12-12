/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = /** @type {ServiceWorkerGlobalScope} */ /** @type {unknown} */ self;

sw.addEventListener('push', (e) => {
	const data = (e as PushEvent).data?.json();
	// @ts-ignore registration not found in service worker type
	sw.registration.showNotification(data.title, {
		body: data.message,
		icon: 'icon512_maskable.png'
	});
});
