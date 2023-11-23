<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { TUser } from '../../routes/profile/+page.server';
	export let friends: TUser = [];
</script>

<div class="friends">
	{#each friends as friend, idx (idx)}
		<div class="profile-header" transition:fly={{ y: 100, duration: 1000, delay: idx * 150 }}>
			<img
				alt="avatar"
				width="50px"
				src="https://api.dicebear.com/7.x/bottts/svg?seed={friend?.id}"
			/>
			<div class="name">
				<h3>{friend.name}</h3>
				<small>
					id:{friend.id}
				</small>
			</div>
		</div>
	{/each}
</div>

<style>
	.friends {
		width: 100%;
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
</style>
