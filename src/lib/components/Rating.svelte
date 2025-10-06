<script lang="ts">
	type TProps = { title: string; name: string; value: number };

	let { name, title, value = $bindable(0) }: TProps = $props();
</script>

<fieldset
	class="fieldset w-full max-w-xs rounded-box border border-base-300 bg-base-200 px-4 pt-2 pb-4"
>
	<header class="fieldset-legend">R: {title}</header>
	<input
		name={`review_${name}`}
		class="range range-sm"
		max="4"
		min="0"
		step="1"
		type="range"
		bind:value
	/>
	<div class="mt-1 flex justify-between px-2 text-xs">
		<span>0</span>
		<span>1</span>
		<span>2</span>
		<span>3</span>
		<span>4</span>
	</div>
</fieldset>
