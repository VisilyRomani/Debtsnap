<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { TUser } from '../../routes/profile/+page.server';
	export let friends: TUser = [];
	import Trash from '$lib/icons/trash.svelte';
	import ConfirmDeleteModal from './modal/ConfirmDeleteModal.svelte';
	let confirmModal = false;
	let selectedFriend: { name: string; id: string } | undefined;
	$: if (!confirmModal) {
		selectedFriend = undefined;
	}
</script>

{#each friends as friend, idx (idx)}
	<div class="profile-header" transition:fly={{ y: 100, duration: 500, delay: idx * 150 }}>
		<div style="display:flex; gap: 1em;">
			<img
				alt="avatar"
				width="50px"
				src="https://api.dicebear.com/7.x/bottts/svg?seed={friend?.username}"
			/>
			<div class="name">
				<h3>{friend.name}</h3>
				<small>
					id:{friend.id}
				</small>
			</div>
		</div>
		<div class="button-group">
			<button
				class="trash"
				on:click={() => {
					selectedFriend = friend;
					confirmModal = true;
				}}
			>
				<Trash />
			</button>
		</div>
	</div>
{/each}

<ConfirmDeleteModal bind:confirmModal bind:selectedFriend />

<style>
	.trash {
		width: fit-content;
		height: fit-content;
		background-color: inherit;
		fill: var(--dark-text);
	}
	.trash:hover {
		fill: var(--light-text);
	}
	.profile-header {
		display: flex;
		text-align: center;
		justify-content: space-between;
		border-radius: 0.5em;
		padding: 0.5em;
		gap: 1em;
	}
	.name {
		display: flex;
		flex-direction: column;
		align-items: baseline;
		justify-content: center;
	}
	.button-group {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}
</style>
