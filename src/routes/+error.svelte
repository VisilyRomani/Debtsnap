<script>
	const dots = ['.', '.', '.'];
</script>

<h3>
	Nothing here
	{#each dots as dot}
		<span class="dot">{dot}</span>
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
</style>
