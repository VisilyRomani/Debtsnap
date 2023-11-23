<script lang="ts">
	import { fly } from 'svelte/transition';
	export let requests: { name: string; id: string }[] = [];
</script>

<div class="friends">
	{#each requests as request, idx (idx)}
		<div class="header" transition:fly={{ y: 100, duration: 1000, delay: idx * 150 }}>
			<div style="display:flex;">
				<img
					alt="avatar"
					width="50px"
					src="https://api.dicebear.com/7.x/bottts/svg?seed={request?.id}"
				/>
				<div class="name">
					<h3>{request.name}</h3>
				</div>
			</div>
			<div class="button-group">
				<button>Accept</button>
				<button>Deny</button>
			</div>
		</div>
	{/each}
</div>

<style>
	.button-group {
		display: flex;
		gap: 0.5em;
	}
	.friends {
		width: 100%;
	}
	.header {
		margin: 0.5em;
		width: 100%;
		display: flex;
		text-align: center;
		gap: 1em;
		justify-content: space-between;
	}
	.name {
		display: flex;
		flex-direction: column;
		align-items: baseline;
		justify-content: center;
	}
</style>
