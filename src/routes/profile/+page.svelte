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

	let showRequest = false;
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

	const getFriends = async () => {
		return (
			(
				await pb
					.collection('users')
					.getOne<{ expand: { friends: { id: string; name: string; username: string }[] } }>(
						$currentUser?.id ?? '',
						{
							expand: 'friends',
							fields: 'expand.friends.id,expand.friends.name,expand.friends.username'
						}
					)
			).expand?.friends ?? []
		);
	};

	const getFriendRequests = async () => {
		return (
			(
				await pb
					.collection('friend_request')
					.getFullList<{ expand: { sender: { id: string; name: string } }; id: string }>({
						expand: 'sender',
						fields: 'expand.sender.id,expand.sender.name,expand.sender.username,id'
					})
			).map((d) => ({ id: d.id, sender_id: d.expand.sender.id, name: d.expand.sender.name })) ?? []
		);
	};

	let friends: TUser;
	let requests: { id: string; sender_id: string; name: string }[];

	pb.collection('users').subscribe('*', async () => {
		friends = await getFriends();
	});
	pb.collection('friend_request').subscribe('*', async () => {
		requests = await getFriendRequests();
	});

	onMount(async () => {
		friends = await getFriends();
		requests = await getFriendRequests();
	});

	onDestroy(() => {
		pb.collection('users').unsubscribe('friends');
		pb.collection('friend_request').unsubscribe('reciever');
	});
</script>

<div class="container">
	<h1>Profile</h1>
	<div class="profile-header">
		<img
			class="avatar"
			alt="avatar"
			width="50px"
			src="https://api.dicebear.com/7.x/bottts/svg?seed={$currentUser?.id}"
		/>
		<div class="name">
			<h3>
				{$currentUser?.name}
			</h3>
			<small>
				id:{$currentUser?.id}
			</small>
		</div>
	</div>
	<hr />
	<div class="multi-select">
		<button type="button" class="multi-button" on:click={() => (showRequest = false)}>
			<h2 style={!showRequest ? 'color:var(--light-text)' : ''}>Friends</h2>
		</button>
		<button type="button" class="multi-button" on:click={() => (showRequest = true)}>
			<h2 style={showRequest ? 'color:var(--light-text)' : ''}>Requests</h2>
		</button>
	</div>
	<hr style="width: 90%;" />
	{#if showRequest}
		<Requests {requests} />
	{:else}
		<Friends {friends} />
	{/if}
</div>
{#if showRequest}
	<div class="add">
		<button style="all:unset;" on:click={() => (showModal = true)}>
			<Add size={50} />
		</button>
	</div>
{/if}

<Modal bind:showModal>
	<form action="/profile?/sendFriendRequest" method="post" use:enhance>
		<h3>Add Friend</h3>
		<div class="friend-container">
			<div>
				<input
					name="friend_id"
					bind:value={$form.friend_id}
					placeholder="Friend ID"
					aria-invalid={$errors.friend_id ? 'true' : undefined}
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
	.multi-select {
		display: flex;
		width: 100%;
		justify-content: space-around;
		color: var(--dark-text);
	}
	.multi-button {
		color: inherit;
		background-color: inherit;
	}

	.multi-button:hover {
		color: var(--light-text);
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
	}
	.profile-header {
		margin: 0.5em;
		width: 100%;
		display: flex;
		text-align: center;
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

	.add {
		position: absolute;
		right: 30px;
		bottom: 80px;
	}
	.add {
		fill: var(--dark-text);
	}

	.add:hover {
		fill: var(--light-text);
	}
	.invalid {
		color: rgb(175, 56, 56);
		background-color: rgb(232, 174, 174);
		padding: 0.2em;
		margin: 0;
		border-radius: 0.4em;
	}
</style>
