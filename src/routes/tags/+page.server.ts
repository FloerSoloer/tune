import { pool, sql } from '$lib/server/db/pool';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async function () {
	const tags = pool.any(sql.typeAlias('tag')`SELECT * FROM tag`);

	return {
		tags
	};
};

export const actions = {
	async default({ request }) {
		const data = await request.formData();
		const name = data.get('name');
		const cat = data.get('cat');

		await pool.query(sql.typeAlias('void')`INSERT INTO tag (name, cat) VALUES (${name}, ${cat})`);

		return {
			data: { cat, name },
			name: 'default',
			ok: true
		};
	}
} satisfies Actions;
