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
			// User accepted to install the application
		} else {
			console.log('dec', choice?.outcome);

			// User dismissed the prompt
		}
		deferredInstallEvent = undefined;
	}
</script>

<div class="container">
	<h1 id="header">Control Your Finances</h1>
	<p>
		DebtSnap allows you to track your debts with all of your friends. Never argue about who paid for
		what ever again.
	</p>
	{#if deferredInstallEvent}
		<button class="install-button" on:click={handleInstall}>Install</button>
	{/if}
	<button on:click={handleInstall} id="installApp" type="button" class="download">Download</button>
</div>

<style>
	.download {
		font-size: x-large;
		width: fit-content;
		border-radius: 1em;
	}
	.container {
		gap: 2em;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3em;
		/* text-align: center; */
		grid-template-columns: 1fr 1fr;
		background-color: var(--light-accent);
	}
	#header {
		font-size: 5em;
	}

	@media (max-width: 1000px) {
		.container {
			/* text-align: center; */
			align-items: start;
		}
		#header {
			font-size: 3.5em;
		}
	}
</style>
