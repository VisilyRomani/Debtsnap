<script>
	const dots = ['.', '.', '.'];
</script>

<h3>
	Nothing here
	{#each dots as dot}
		<span>{dot}</span>
	{/each}
</h3>

<style>
	h3 {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	span:nth-child(1) {
		animation-delay: 0ms;
		animation: 1s infinite elip ease-in-out;
	}
	span:nth-child(2) {
		animation: 1s infinite elip ease-in-out;
		animation-delay: 100ms;
	}
	span:nth-child(3) {
		animation: 1s infinite elip ease-in-out;
		animation-delay: 200ms;
	}
	@keyframes elip {
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-5px);
		}
		100% {
			transform: translateY(0px);
		}
	}
</style>
