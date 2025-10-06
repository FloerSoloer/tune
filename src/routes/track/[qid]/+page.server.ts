import { pool, sql } from '$lib/server/db/pool';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function ({ params }) {
	const { qid } = params;

	const track_cluster = pool.maybeOne(
		sql.typeAlias('track_cluster')`SELECT
	track_cluster.name,
	track_cluster.len,
	track_cluster.review_pending,
	track_cluster.review_oa,
	track_cluster.review_comp,
	track_cluster.review_meaning,
	(
		SELECT ARRAY_AGG(track.id)
		FROM track
		WHERE track.cluster = track_cluster.id
	) tracks
FROM track_cluster
WHERE track_cluster.qid = ${qid}`
	);

	return {
		track_cluster
	};
};
