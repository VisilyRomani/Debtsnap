import { SECRET_EMAIL, SECRET_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';

export const server_pb = new PocketBase('https://svelte-debt.fly.dev');

await server_pb.admins.authWithPassword(SECRET_EMAIL, SECRET_PASSWORD);
