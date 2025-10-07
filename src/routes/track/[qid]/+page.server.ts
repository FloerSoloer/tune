import { ErrorWithNotif } from '$lib/components/Notifs.store';
import { parseErrorNotif } from '$lib/parseErrorData';
import { pool, sql, z__track_cluster } from '$lib/server/db/pool';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function ({ params }) {
	const { qid } = params;

	const track_cluster = pool.maybeOne(
		sql.typeAlias('track_cluster')`
			SELECT
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
			WHERE track_cluster.qid = ${qid}
`
	);

	return {
		track_cluster
	};
};

export const actions = {
	async default({ request, params }) {
		const name = 'default' as const;

		try {
			const req_data = await request.formData();

			// Validate int fields (necessary for parsing)
			const int_fields: Record<string, number> = {
				len: NaN,
				review_oa: NaN,
				review_comp: NaN,
				review_meaning: NaN
			};
			for (const field in int_fields) {
				const value_str = req_data.get(field);
				if (typeof value_str !== 'string')
					throw new ErrorWithNotif({ title: `Invalid ${field}`, msg: 'Must be an integer' });
				int_fields[field] = parseInt(value_str);
			}

			const track_cluster = await z__track_cluster.parseAsync({
				...int_fields,
				qid: params.qid,
				name: req_data.get('name'),
				review_pending: Boolean(req_data.get('review_pending')),
				tracks: req_data.getAll('tracks')
			});

			const track_cluster_query = sql.typeAlias('id')`
				INSERT INTO track_cluster (
					qid,
					name,
					len,
					review_pending,
					review_oa,
					review_comp,
					review_meaning
				) VALUES (
					${track_cluster.qid},
					${track_cluster.name},
					${track_cluster.len},
					${track_cluster.review_pending},
					${track_cluster.review_oa},
					${track_cluster.review_comp},
					${track_cluster.review_meaning}
				)
				ON CONFLICT (qid) DO UPDATE SET
					qid = excluded.qid,
					name = excluded.name,
					len = excluded.len,
					review_pending = excluded.review_pending,
					review_oa = excluded.review_oa,
					review_comp = excluded.review_comp,
					review_meaning = excluded.review_meaning
				RETURNING track_cluster.id
			`;

			await pool.transaction(async function (tx) {
				const cluster_id = await tx.oneFirst(track_cluster_query);

				const unnest_cluster = [];

				for (const track of track_cluster.tracks) unnest_cluster.push([track, cluster_id]);
				const tracks_query = sql.typeAlias('void')`
					WITH tracks AS (
						INSERT INTO track (id, cluster)
						SELECT * FROM ${sql.unnest(unnest_cluster, ['text', 'int4'])}
						ON CONFLICT (id) DO UPDATE SET
							cluster = excluded.cluster
						RETURNING track.id
					)
					DELETE FROM track WHERE
						cluster = ${cluster_id} AND
						NOT EXISTS (SELECT 1 FROM tracks WHERE track.id = tracks.id)
				`;
				await tx.query(tracks_query);
			});

			return { name, ok: true } as const;
		} catch (e) {
			console.error('/track/[qid]/+page.server?/default', e);
			const data = parseErrorNotif('/track/[qid]/+page.server?/default', e);
			return {
				data,
				name,
				ok: false
			} as const;
		}
	}
} satisfies Actions;
