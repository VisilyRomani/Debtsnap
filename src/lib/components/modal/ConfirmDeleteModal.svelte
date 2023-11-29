<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import Modal from './Modal.svelte';
	import toast from 'svelte-french-toast';

	export let confirmModal = false;
	export let selectedFriend: { name: string; id: string } | undefined;

	const requestDelete = async () => {
		if (!selectedFriend?.id) {
			confirmModal = false;
			toast.error('Error deleting friend');
			console.error('No friend id!');
			return;
		}
		const reponse = await fetch('/api/deleteFriend', {
			method: 'post',
			body: JSON.stringify({ user: $currentUser?.id, friend: selectedFriend?.id })
		});
		if (reponse.ok) {
			toast.success('Friend Deleted');
		} else {
			toast.error('Error deleting friend');
		}
		confirmModal = false;
	};
</script>

<Modal bind:showModal={confirmModal}>
	<div class="cont">
		<div>
			<h2>Confirm</h2>
			<h4>
				Are you sure you want to delete
				<span>
					{selectedFriend?.name}
				</span>?
			</h4>
		</div>
		<div class="button-group">
			<button type="button" on:click={() => (confirmModal = false)}> Cancel </button>
			<button type="button" on:click={requestDelete}> Submit </button>
		</div>
	</div>
</Modal>

<style>
	.cont {
		text-align: center;
		display: flex;
		gap: 1em;
		flex-direction: column;
	}
	.button-group {
		display: flex;
		gap: 0.5em;
	}
	span {
		color: rgb(175, 56, 56);
		font-size: large;
		font-weight: bold;
	}
</style>
