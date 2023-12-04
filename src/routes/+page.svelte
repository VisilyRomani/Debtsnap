<script lang="ts">
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { statusColor } from '$lib/functions/helper';
	let deferredInstallEvent: any;
	let hiddenElements: NodeListOf<Element>;
	import Trash from '$lib/icons/trash.svelte';

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredInstallEvent = e;
		});
		hiddenElements = document.querySelectorAll('.hidden');
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

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((e) => {
			if (e.isIntersecting) {
				e.target.classList.add('show');
				console.log('s');
			} else {
				e.target.classList.remove('show');
				console.log('r');
			}
		});
	});

	$: hiddenElements?.forEach((e) => observer.observe(e));

	let width = 0;
</script>

<div class="container">
	<section class="container-header">
		<div class="background-overlay">
			<div class="background-shade hidden">
				<h1 bind:offsetWidth={width} id="header">Control Your Finances</h1>
				<p id="sub-header" style="max-width: {width + 100}px;">
					DebtSnap simplifies social finances by effortlessly tracking shared expenses among
					friends, eliminating the need for endless arguments over who paid for what. Enjoy
					real-time updates, expense management, and equitable settlements, embracing a new era of
					financial harmony within your social circles.
				</p>
				{#if deferredInstallEvent}
					<button on:click={handleInstall} id="installApp" type="button" class="download">
						Download
					</button>
				{/if}
			</div>
		</div>
	</section>
	<section class="secondary hidden">
		<div class="point">
			<h1>Real-Time Updates</h1>
			<p>
				Experience the ease of real-time expense updates. Stay in the know about who owes what,
				ensuring transparency and eliminating confusion.
			</p>
		</div>
		<div class="debt-container">
			<div class="friend hidden" style={statusColor('completed')}>
				<img
					class="avatar"
					alt="avatar"
					width="50px"
					src="https://api.dicebear.com/7.x/bottts/svg?seed={123123}"
				/>

				<div style="display: flex; flex-direction: column;">
					<h3>${(3232 / 100).toFixed(2)}</h3>
					<small> To: Visily Romani </small>
					<small> Description: App Creation </small>
					<small> Payment: E-Transfer </small>
				</div>

				<div class="pay">
					<div>
						<p>
							{dayjs(new Date()).format('DD/MM/YYYY')}
						</p>
						<p>
							{dayjs(new Date()).format('h:mm A')}
						</p>
					</div>
					<div class="grid-section">
						<h3>Resolved</h3>
					</div>
				</div>
			</div>
			<div class="friend hidden" style={statusColor('completed')}>
				<img
					class="avatar"
					alt="avatar"
					width="50px"
					src="https://api.dicebear.com/7.x/bottts/svg?seed={12231223}"
				/>

				<div style="display: flex; flex-direction: column;">
					<h3>${(3232 / 100).toFixed(2)}</h3>
					<small> To: Visily Romani </small>
					<small> Description: App Creation </small>
					<small> Payment: E-Transfer </small>
				</div>

				<div class="pay">
					<div>
						<p>
							{dayjs(new Date()).format('DD/MM/YYYY')}
						</p>
						<p>
							{dayjs(new Date()).format('h:mm A')}
						</p>
					</div>
					<div class="grid-section">
						<h3>Resolved</h3>
					</div>
				</div>
			</div>
			<div class="friend hidden" style={statusColor('completed')}>
				<img
					class="avatar"
					alt="avatar"
					width="50px"
					src="https://api.dicebear.com/7.x/bottts/svg?seed={1333123}"
				/>

				<div style="display: flex; flex-direction: column;">
					<h3>${(3232 / 100).toFixed(2)}</h3>
					<small> To: Visily Romani </small>
					<small> Description: App Creation </small>
					<small> Payment: E-Transfer </small>
				</div>

				<div class="pay">
					<div>
						<p>
							{dayjs(new Date()).format('DD/MM/YYYY')}
						</p>
						<p>
							{dayjs(new Date()).format('h:mm A')}
						</p>
					</div>
					<div class="grid-section">
						<h3>Resolved</h3>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="secondary hidden">
		<div class="point">
			<h1>Seamless Expense Management</h1>
			<p>
				DebtSnap streamlines expense management, allowing you to focus on moments with friends
				rather than worrying about finances. Track, manage, and settle expenses effortlessly.
			</p>
		</div>
		<div class="confirm-container">
			<div class="confirm hidden">
				<h2>Jason</h2>

				<div style="display: flex; justify-content:space-between; align-items:center;">
					<h3>Payment:</h3>
					<small> E-transfer </small>
				</div>

				<div style="display: flex; justify-content:space-between; align-items:center;">
					<h3>For</h3>
					<small>
						Dinner - ${(2312 / 100).toFixed(2)}
					</small>
				</div>

				<div style="display:flex; gap:1em;font-size: 1.2em; ">
					<button type="button">Decline</button>
					<button type="button">Accept</button>
				</div>
			</div>
		</div>
	</section>
	<section class="secondary hidden">
		<div class="point">
			<h1>Stay Connected, Stay Transparent</h1>
			<p>
				Connect with your friends seamlessly through DebtSnap. It's not just about tracking
				expenses; it's about fostering transparent financial relationships within your social
				network.
			</p>
		</div>
		<div class="connection-container">
			<div class="friend-header hidden">
				<div style="display:flex; gap: 1em;">
					<img
						alt="avatar"
						width="50px"
						src="https://api.dicebear.com/7.x/bottts/svg?seed={23123}"
					/>

					<div class="name">
						<h3>Jue Smith</h3>
						<small> ID: lasdhkfjha1231 </small>
					</div>
				</div>
				<div class="button-group">
					<button>Accept</button>
					<button>Deny</button>
				</div>
			</div>
			<div class="profile-header hidden">
				<div style="display:flex; gap: 1em;">
					<img
						alt="avatar"
						width="50px"
						src="https://api.dicebear.com/7.x/bottts/svg?seed=fgdsdfgrr"
					/>
					<div class="name">
						<h3>Michael</h3>
						<small> ID: sdfsefsafsfe </small>
					</div>
				</div>
				<div class="button-group">
					<button class="trash">
						<Trash />
					</button>
				</div>
			</div>
			<div class="profile-header hidden">
				<div style="display:flex; gap: 1em;">
					<img
						alt="avatar"
						width="50px"
						src="https://api.dicebear.com/7.x/bottts/svg?seed=fdsegsdfgrr"
					/>
					<div class="name">
						<h3>Jason</h3>
						<small> ID: 3dfg4g334hs </small>
					</div>
				</div>
				<div class="button-group">
					<button class="trash">
						<Trash />
					</button>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.container {
		overflow-x: hidden;
	}
	.point {
		margin: 5em;
		display: grid;
		place-content: center;
	}
	.secondary {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 70vh;
		justify-content: space-between;
	}
	.secondary:nth-child(even) {
		background-color: white;
	}

	.debt-container {
		width: 100%;
		overflow-y: auto;
		display: grid;
		place-content: center;
	}
	.pay {
		width: fit-content;
		display: grid;
		grid-template-rows: 1fr 1fr;
		justify-content: center;
		text-align: center;
		gap: 1em;
	}
	.friend {
		display: grid;
		grid-template-columns: auto 1fr min-content;
		gap: 1em;
		justify-items: start;
		align-items: center;
		background-color: var(--main-bg-color);
		box-shadow: 0px 0px 5px 1px rgba(189, 189, 189, 0.527);
		border-radius: 0.5em;
		padding: 1em;
		margin: 1em;
	}

	.download {
		font-size: max(1.5vw, 1.3em);
		width: fit-content;
		border-radius: 1em;
	}
	.background-overlay {
		gap: 2em;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		grid-template-columns: 1fr 1fr;
		text-align: center;
		background: rgb(86, 130, 89);
		background: linear-gradient(
			170deg,
			rgba(86, 130, 89, 0.4) 0%,
			rgba(204, 252, 203, 0.9) 51%,
			rgba(86, 130, 89, 0.4) 100%
		);

		height: 80vh;
		color: var(--dark-text);
	}
	.background-shade {
		width: fit-content;
		height: fit-content;
		padding: 2em;
		gap: 2em;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.container-header {
		background-image: url('/images/forest.jpg');
		background-color: var(--light-accent);
		background-size: cover;
	}
	#header {
		font-size: max(6vw, 3em);
		font-family: Arial, Helvetica, sans-serif;
	}

	#sub-header {
		font-size: max(1.3vw, 1em);
	}

	.secondary:nth-child(even) > .point {
		order: 1;
	}
	@media (max-width: 1000px) {
		.secondary {
			grid-template-columns: 1fr;
		}
		.secondary:nth-child(even) > .point {
			order: -1;
		}
	}

	.connection-container {
		margin: 1em;
		display: grid;
		place-content: center;
	}

	/* Friend Requests */
	.button-group {
		display: flex;
		gap: 0.5em;
	}

	.friend-header {
		background-color: var(--light-accent);
		display: flex;
		border-radius: 0.5em;

		justify-content: space-between;
		text-align: center;
		padding: 0.5em;
		gap: 1em;
		animation: flash 1.5s linear infinite;
	}
	.name {
		display: flex;
		flex-direction: column;
		align-items: baseline;
		justify-content: center;
	}

	@keyframes flash {
		0% {
			background-color: var(--light-accent);
		}
		50% {
			background-color: inherit;
		}
		100% {
			background-color: var(--light-accent);
		}
	}

	/* Friends */

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

	/* confirm */
	.confirm {
		border-left: 8px solid var(--dark-accent);
		display: flex;
		min-width: 300px;
		flex-direction: column;
		height: 10em;
		box-shadow: 0px 0px 5px 1px rgba(189, 189, 189, 0.527);
		padding: 1em;
		justify-content: space-between;
		gap: 0.5em;
		text-align: center;
		margin: 1em;
		border-radius: 0.5em;
	}
	.confirm-container {
		display: grid;
		place-content: center;
	}
</style>
