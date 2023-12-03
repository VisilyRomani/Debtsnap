<script lang="ts">
	import { onMount } from 'svelte';
	let deferredInstallEvent: any;

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredInstallEvent = e;
		});
	});

	async function handleInstall() {
		deferredInstallEvent?.prompt();
		let choice = await deferredInstallEvent?.userChoice;
		if (choice?.outcome === 'accepted') {
			console.log('acc');
		} else {
			console.log('dec');
		}
		deferredInstallEvent = undefined;
	}
	let width = 0;
</script>

<div class="container">
	<h1 bind:offsetWidth={width} id="header">Control Your Finances</h1>
	<p id="sub-header" style="max-width: {width + 100}px;">
		DebtSnap simplifies social finances by effortlessly tracking shared expenses among friends,
		eliminating the need for endless arguments over who paid for what. Enjoy real-time updates,
		expense management, and equitable settlements, embracing a new era of financial harmony within
		your social circles.
	</p>
	{#if deferredInstallEvent}
		<button on:click={handleInstall} id="installApp" type="button" class="download">
			Download
		</button>
	{/if}
</div>
<div class="selling-points">
	<div class="secondary">
		<div class="point">
			<h1>Real-Time Updates</h1>
			<p>
				Experience the ease of real-time expense updates. Stay in the know about who owes what,
				ensuring transparency and eliminating confusion.
			</p>
		</div>
		<div>df</div>
	</div>

	<div class="secondary">
		<div class="point">
			<h1>Seamless Expense Management</h1>
			<p>
				DebtSnap streamlines expense management, allowing you to focus on moments with friends
				rather than worrying about finances. Track, manage, and settle expenses effortlessly.
			</p>
		</div>
		<div>df</div>
	</div>
	<div class="secondary">
		<div class="point">
			<h1>Stay Connected, Stay Transparent</h1>
			<p>
				Connect with your friends seamlessly through DebtSnap. It's not just about tracking
				expenses; it's about fostering transparent financial relationships within your social
				network.
			</p>
		</div>
		<div>df</div>
	</div>
</div>

<style>
	.point {
		margin: 5em;
	}
	.secondary {
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: 3em;
		justify-content: space-between;
	}
	.secondary:nth-child(even) {
		background-color: white;
	}
	.secondary:nth-child(even) > .point {
		order: 1;
	}

	.download {
		font-size: max(1.5vw, 1.3em);
		width: fit-content;
		border-radius: 1em;
	}
	.container {
		gap: 2em;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3em;
		grid-template-columns: 1fr 1fr;
		background-color: var(--light-accent);
		text-align: center;
	}
	#header {
		font-size: max(5vw, 2em);
	}

	#sub-header {
		font-size: max(1.3vw, 1em);
	}

	@media (max-width: 1000px) {
		.container {
			align-items: start;
			text-align: start;
		}
		.secondary {
			grid-template-columns: 1fr;
		}
	}
</style>
