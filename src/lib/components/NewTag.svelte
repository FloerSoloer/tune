<script lang="ts">
	import IconMdiBookshelf from '~icons/mdi/bookshelf';
	import IconMdiCheck from '~icons/mdi/check';
	import IconMdiClose from '~icons/mdi/close';
	import IconMdiTagOutline from '~icons/mdi/tag-outline';
	import IconMdiTagPlusOutline from '~icons/mdi/tag-plus-outline';

	import { enhance } from '$app/forms';
</script>

<section class="inline font-mono text-sm">
	<input id="new-tag--show" class="hidden" type="checkbox" />
	<div class="relative -me-2 hidden w-3xs [:checked~&]:block">
		<form
			class="absolute flex w-full gap-1 rounded-full bg-primary py-1.5 ps-4 pe-5"
			action="/tags"
			method="POST"
			use:enhance
		>
			<div class="flex flex-col justify-center gap-y-0.5">
				<label class="btn btn-circle btn-ghost btn-xs btn-error" for="new-tag--show" title="Close">
					<IconMdiClose height="75%" width="75%" />
				</label>
				<button class="btn btn-circle btn-ghost btn-xs btn-success" title="Add Tag" type="submit">
					<IconMdiCheck height="75%" width="75%" />
				</button>
			</div>
			<div class="flex grow flex-col justify-center gap-y-1">
				<label class="validator input input-xs input-ghost px-1.5 text-sm">
					<IconMdiTagOutline />
					<input
						name="name"
						autocomplete="off"
						pattern={`[0-9a-z]([0-9a-z_]{0,30}[0-9a-z])?`}
						placeholder="tag_name"
						required
						type="text"
					/>
				</label>
				<label class="validator input input-xs input-ghost px-1.5 text-sm">
					<IconMdiBookshelf />
					<input
						name="cat"
						autocomplete="off"
						pattern={`[0-9a-z]([0-9a-z_]{0,30}[0-9a-z])?`}
						placeholder="tag_category"
						required
						type="text"
					/>
				</label>
			</div>
		</form>
	</div>
	<label
		class="btn flex h-auto items-center rounded-full px-2.5 btn-primary [:checked~&]:hidden"
		for="new-tag--show"
	>
		<IconMdiTagPlusOutline height="0.75lh" width="0.75lh" /> New Tag
	</label>
</section>
