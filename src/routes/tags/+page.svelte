<script lang="ts">
	import type { PageProps } from './$types';

	import NewTag from '$lib/components/NewTag.svelte';
	import { notifs } from '$lib/components/Notifs.store';

	let { data, form }: PageProps = $props();

	$effect(function () {
		if (!form) return;
		if (!form.ok) {
			notifs.push(form.data);
			return;
		}
		switch (form.name) {
			case 'default':
				notifs.push({ title: `Added #${form.data.name}` });
				break;
		}
	});
</script>

<main class="flex flex-wrap gap-1.5">
	{#await data.tags then tags}
		{#each tags as tag (tag.name)}
			<p
				class="inline-flex rounded-full bg-secondary px-2.5 py-0.25 font-mono text-sm text-secondary-content"
			>
				{tag.name}
			</p>
		{/each}
	{/await}
	<NewTag />
</main>
