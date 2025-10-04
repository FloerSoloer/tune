import { pool, sql } from '$lib/server/db/pool';
import { UniqueIntegrityConstraintViolationError } from 'slonik';
import type { Actions, PageServerLoad } from './$types';
import { ErrorWithNotif } from '$lib/components/Notifs.store';
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

			const req_name = req_data.get('name');
			if (!req_name) throw new ErrorWithNotif({ title: 'Tag name is required' });
			// for use in error logging; dont throw, let zod throw instead
			if (typeof req_name === 'string') tag_name = `#${req_name}`;

			const req_cat = req_data.get('cat');
			if (!req_cat) throw new ErrorWithNotif({ title: 'Tag category is required' });

			await pool.query(
				sql.typeAlias('void')`INSERT INTO tag (name, cat) VALUES (${req_name}, ${req_cat})`
			);

			return {
				data: { cat: req_cat, name: req_name },
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
