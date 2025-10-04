import { pool, sql, z__tag } from '$lib/server/db/pool';
import { UniqueIntegrityConstraintViolationError } from 'slonik';
import type { Actions, PageServerLoad } from './$types';
import { parseErrorNotif } from '$lib/parseErrorData';

export const load: PageServerLoad = async function () {
	const tags = pool.any(sql.typeAlias('tag')`SELECT * FROM tag`);

	return {
		tags
	};
};

export const actions = {
	async default({ request }) {
		const name = 'default' as const;
		// for use in error logging
		let tag_name = 'Tag';

		try {
			const req_data = await request.formData();
			const tag = await z__tag.parseAsync({
				category: req_data.get('category'),
				name: req_data.get('name')
			});
			tag_name = `#${tag.name}`;

			await pool.query(
				sql.typeAlias(
					'void'
				)`INSERT INTO tag (name, category) VALUES (${tag.name}, ${tag.category})`
			);

			return {
				data: tag,
				name,
				ok: true
			} as const;
		} catch (e) {
			const data = parseErrorNotif('/tags/+page.server?/default', e, function (e) {
				if (e instanceof UniqueIntegrityConstraintViolationError)
					return { title: `${tag_name} already exists` };
				return false;
			});
			return {
				data,
				name,
				ok: false
			} as const;
		}
	}
} satisfies Actions;
