<script lang="ts">
	import { notifs } from './Notifs.store';
</script>

{#each $notifs as notif (notif.id)}
	<div>{notif.title}</div>
{/each}
