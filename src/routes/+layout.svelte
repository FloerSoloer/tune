<script lang="ts">
	import Notifs from '$lib/components/Notifs.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<Notifs />
{@render children?.()}
