import { ErrorWithNotif } from '$lib/components/Notifs.store';
import { parseErrorNotif } from '$lib/parseErrorData';
import { pool, sql, z__track_cluster } from '$lib/server/db/pool';
import type { Actions } from './$types';
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

			console.log('/track/[qid]/+page.server?/default', track_cluster);

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
