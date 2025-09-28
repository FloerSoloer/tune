import { pool, sql } from '$lib/server/db/pool';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function () {
	const tags = pool.many(sql.typeAlias('tag')`SELECT * FROM tag`);

	return {
		tags
	};
};
