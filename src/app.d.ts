// See https://kit.svelte.dev/docs/types#app
import type PocketBase from 'pocketbase';
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			server_pb: PocketBase;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
