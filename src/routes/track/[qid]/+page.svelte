<script lang="ts">
	import IconMdiCheck from '~icons/mdi/check';
	import IconMdiMinus from '~icons/mdi/minus';
	import IconMdiPlus from '~icons/mdi/plus';

	import type { PageProps } from './$types';
	import type { ChangeEventHandler, MouseEventHandler } from 'svelte/elements';

	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { notifs } from '$lib/components/Notifs.store';
	import Rating from '$lib/components/Rating.svelte';

	const { data, form }: PageProps = $props();

	let init_name = $state<string>('');
	let init_len = $state<number>(1);
	let init_review_pending = $state<boolean>(false);
	let init_review_oa = $state<number>(0);
	let init_review_comp = $state<number>(0);
	let init_review_meaning = $state<number>(0);
	let init_tracks = $state<string[]>(['']);

	let name = $state<string>('');
	let len = $state<number>(1);
	let review_pending = $state<boolean>(false);
	let review_oa = $state<number>(0);
	let review_comp = $state<number>(0);
	let review_meaning = $state<number>(0);
	let tracks = $state<string[]>(['']);

	const edited = $derived(
		init_name !== name ||
			init_len !== len ||
			init_review_pending !== review_pending ||
			init_review_oa !== review_oa ||
			init_review_comp !== review_comp ||
			init_review_meaning !== review_meaning ||
			tracks.join(',') !== init_tracks.join(',')
	);

	$effect(function () {
		(async function () {
			const track_cluster = await data.track_cluster;
			if (!track_cluster) return;
			init_name = name = track_cluster.name;
			init_len = len = track_cluster.len;
			init_review_pending = review_pending = track_cluster.review_pending;
			init_review_oa = review_oa = track_cluster.review_oa;
			init_review_comp = review_comp = track_cluster.review_comp;
			init_review_meaning = review_meaning = track_cluster.review_meaning;
			init_tracks = tracks = [...track_cluster.tracks];
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
		tracks = [...tracks, ''];
	};

	const changeTrack: ChangeEventHandler<HTMLInputElement> = function (ev) {
		const i = ev.currentTarget.dataset.i;
		if (!i) return;
		const new_tracks = [...tracks];
		new_tracks[+i] = ev.currentTarget.value;
		tracks = new_tracks;
	};

	const maybeRemoveTrack: MouseEventHandler<HTMLButtonElement> = function (ev) {
		if (isOneTrack) return;
		const i = ev.currentTarget.dataset.i;
		if (!i) return;
		tracks = tracks.toSpliced(+i, 1);
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
					data-i={i}
					oninput={changeTrack}
					pattern={'(sc:\\d{1,27}|sp:[a-zA-Z0-9]{22}|yt:[a-zA-Z0-9_\\-]{11})(:\\d{1,4}-\\d{1,4})?'}
					required
					type="text"
					value={tracks[i]}
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
	<button
		class={{ 'btn w-full max-w-xs': true, 'btn-warning': edited, 'btn-success': !edited }}
		title="Submit"
		type="submit"
	>
		<IconMdiCheck />
	</button>
</form>
