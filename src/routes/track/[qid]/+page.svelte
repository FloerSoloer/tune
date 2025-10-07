<script lang="ts">
	import IconMdiCheck from '~icons/mdi/check';
	import IconMdiMinus from '~icons/mdi/minus';
	import IconMdiPlus from '~icons/mdi/plus';

	import type { PageProps } from './$types';
	import type { MouseEventHandler } from 'svelte/elements';

	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { notifs } from '$lib/components/Notifs.store';
	import Rating from '$lib/components/Rating.svelte';

	const { data, form }: PageProps = $props();

	let name = $state<string>('');
	let len = $state<number>(1);
	let review_pending = $state<boolean>(false);
	let review_oa = $state<number>(0);
	let review_comp = $state<number>(0);
	let review_meaning = $state<number>(0);
	let tracks = $state<string[]>(['']);

	$effect(function () {
		(async function () {
			const track_cluster = await data.track_cluster;
			if (!track_cluster) return;
			name = track_cluster.name;
			len = track_cluster.len;
			review_pending = track_cluster.review_pending;
			review_oa = track_cluster.review_oa;
			review_comp = track_cluster.review_comp;
			review_meaning = track_cluster.review_meaning;
			tracks = track_cluster.tracks;
		})();
	});

	$effect(function () {
		if (!form) return;
		if (!form.ok) {
			notifs.push(form.data);
			return;
		}
	});

	const isOneTrack = $derived(tracks.length <= 1);

	const addTrack: MouseEventHandler<HTMLButtonElement> = function () {
		tracks.push('');
	};

	const maybeRemoveTrack: MouseEventHandler<HTMLButtonElement> = function (ev) {
		if (isOneTrack) return;
		const i = ev.currentTarget.dataset.i;
		if (!i) return;
		tracks.splice(+i, 1);
	};
</script>

<form
	class="flex flex-col gap-2"
	action={`/track/${page.params.qid}`}
	method="POST"
	use:enhance={function () {
		return async function ({ update }) {
			await update({ reset: false });
		};
	}}
>
	<label class="input block">
		<span>Name</span>
		<input name="name" required type="text" bind:value={name} />
	</label>
	<label class="input block">
		<span>Length</span>
		<input name="len" required type="number" bind:value={len} />
	</label>
	<label class="label block">
		<input name="review_pending" class="checkbox" type="checkbox" bind:checked={review_pending} />
		<span>Pending</span>
	</label>
	<Rating name="oa" title="O/A" bind:value={review_oa} />
	<Rating name="comp" title="Comp" bind:value={review_comp} />
	<Rating name="meaning" title="Meaning" bind:value={review_meaning} />
	<fieldset
		class="fieldset w-full max-w-xs rounded-box border border-base-300 bg-base-200 px-4 pt-2 pb-4"
	>
		<legend class="fieldset-legend">Tracks</legend>
		{#each tracks as track, i (i)}
			<div class="join">
				<input
					name="tracks"
					class="input join-item [border-right-style:none]"
					required
					type="text"
					bind:value={tracks[i]}
				/>
				<button
					class="btn join-item ms-0 btn-outline btn-error"
					data-i={i}
					disabled={isOneTrack}
					onclick={maybeRemoveTrack}
					title={`Remove ${track}`}
					type="button"
				>
					<IconMdiMinus />
				</button>
			</div>
		{/each}
		<button class="btn btn-outline btn-success" onclick={addTrack} title="Add Track" type="button">
			<IconMdiPlus />
		</button>
	</fieldset>
	<button class="btn w-full max-w-xs btn-success" title="Submit" type="submit">
		<IconMdiCheck />
	</button>
</form>
