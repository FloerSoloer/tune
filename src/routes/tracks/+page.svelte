<script lang="ts">
	import short from 'short-uuid';
	import IconMdiPlus from '~icons/mdi/plus';

	const translator = short();
	const next_qid = translator.new();
</script>

<a class="btn btn-primary" href={`/track/${next_qid}`} title="New Track Cluster">
	<IconMdiPlus />
</a>
