<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		// Nothing on this page so go straight to dashboard
		goto('/dashboard');
	});
</script>
