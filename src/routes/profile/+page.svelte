<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import { onDestroy, onMount } from 'svelte';
	import Add from '$lib/icons/add.svelte';
	import Modal from '$lib/components/modal/Modal.svelte';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import Friends from '$lib/components/friends.svelte';
	import type { TUser } from './+page.server';
	import Requests from '$lib/components/requests.svelte';
	import toast from 'svelte-french-toast';
	import { getFriendRequests, getFriends } from '$lib/functions/friend';

	let showModal = false;
	export let data: PageData;

	const { form, errors, enhance, reset } = superForm(data.friendForm, {
		taintedMessage: null,
		resetForm: true,
		onSubmit: ({ formData }) => {
			formData.append('id', $currentUser?.id ?? '');
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Friend request Sent');
				showModal = !showModal;
			}
		}
	});

	$: showModal && reset();

	let friends: TUser;
	let requests: { id: string; sender_id: string; name: string; username: string }[];

	pb.collection('users').subscribe('*', async () => {
		friends = await getFriends($currentUser?.id ?? '');
	});
	pb.collection('friend_request').subscribe('*', async () => {
		requests = await getFriendRequests();
	});

	onMount(async () => {
		friends = await getFriends($currentUser?.id ?? '');
		requests = await getFriendRequests();
	});

	onDestroy(() => {
		pb.collection('users').unsubscribe('friends');
		pb.collection('friend_request').unsubscribe('reciever');
	});
</script>

<div class="container">
	<h1>Profile</h1>
	<div class="header-container">
		<button
			class="profile-header"
			on:click={async () => {
				try {
					await navigator.clipboard.writeText($currentUser?.username ?? '');
					toast.success('Copied Id');
				} catch (e) {
					toast.error('Failed to copy Id');
				}
			}}
		>
			<img
				class="avatar"
				alt="avatar"
				width="50px"
				src="https://api.dicebear.com/7.x/bottts/svg?seed={$currentUser?.username}"
			/>
			<div class="name">
				<h3>
					{$currentUser?.name}
				</h3>
				<small>
					id:{$currentUser?.id}
				</small>
			</div>
		</button>
		<button style="width: fit-content; margin:1em;" on:click={() => (showModal = true)}>
			Add Friend
		</button>
	</div>
	<div style="width:100%; ">
		{#if !!requests?.length}
			<Requests {requests} />
			<hr style="width: 90%;" />
		{/if}
		<Friends {friends} />
	</div>
</div>
<button on:click={() => pb.authStore.clear()}>Log Out</button>

<Modal bind:showModal>
	<form action="/profile?/sendFriendRequest" method="post" use:enhance>
		<h3>Add Friend</h3>
		<div class="friend-container">
			<div>
				<input
					name="friend_id"
					bind:value={$form.friend_id}
					placeholder="Friend ID"
					style={$errors.friend_id && 'border:2px solid rgb(232, 174, 174)'}
				/>
				{#if $errors.friend_id}<p class="invalid">{$errors.friend_id}</p>{/if}
			</div>
			<div>
				<button style="width: fit-content;">Submit</button>
			</div>
		</div>
	</form>
</Modal>

<style>
	.header-container {
		display: flex;
		justify-content: space-between;
		width: 100%;
		border-radius: 0.5em;
		box-shadow: 1px 1px 1px 1px gray;
	}
	.friend-container {
		display: flex;
		gap: 1em;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		margin: 0em 1em 0em 1em;
		padding-top: 1em;
		gap: 1em;
	}
	.profile-header {
		margin: 0.5em;
		width: fit-content;
		display: flex;
		background-color: inherit;
		color: var(--dark-text);
		/* text-align: center; */
		gap: 1em;
	}
	.name {
		display: flex;
		flex-direction: column;
		align-items: baseline;
		justify-content: center;
	}

	hr {
		width: 100%;
		border-bottom: 1px solid var(--dark-text);
	}

	.invalid {
		color: rgb(175, 56, 56);
		background-color: rgb(232, 174, 174);
		padding: 0.2em;
		margin: 0;
		border-radius: 0.4em;
	}
</style>
