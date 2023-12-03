/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = /** @type {ServiceWorkerGlobalScope} */ /** @type {unknown} */ self;

import { build, files, version } from '$service-worker';

sw.addEventListener('fetch', (e) => {
	// console.log(e);
	const a = async () => {
		return fetch((e as FetchEvent).request);
	};

	(e as FetchEvent).respondWith(a());
});
