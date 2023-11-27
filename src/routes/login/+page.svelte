<script lang="ts">
	import Login from '$lib/components/login.svelte';
	import Signup from '$lib/components/signup.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let isLogin = true;
</script>

{#if isLogin}
	<Login bind:isLogin />
{:else}
	<Signup bind:isLogin {data} />
{/if}
