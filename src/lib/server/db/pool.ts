import { env } from '$env/dynamic/private';
import z from 'zod';
import { createPool, createSqlTag } from 'slonik';
import { createPgDriverFactory } from '@slonik/pg-driver';
import short from 'short-uuid';

export const pool = await createPool(
	`postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@localhost:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
	{
		driverFactory: createPgDriverFactory()
	}
);

const re__tag = /^[a-z0-9]([a-z0-9_]{0,30}[a-z0-9])?$/;
const re__qid = new RegExp(`[${short.constants.flickrBase58}]{22}`);
/**
 * ? sc 27 is uncertain
 */
const re__track__id = /(sc:\d{1,27}|sp:[a-zA-Z0-9]{22}|yt:[a-zA-Z0-9_-]{11})(:\d{1,4}-\d{1,4})?/;

function z_Rating() {
	return z.number().int().gte(-32768).lte(32767);
}

export const z__tag = z.object({
	category: z.string().regex(re__tag),
	name: z.string().regex(re__tag)
});

export const z__track_cluster = z.object({
	qid: z.string().regex(re__qid),
	name: z.string().min(1).max(64),
	len: z.number().int().gte(1).lte(9999),
	review_pending: z.boolean(),
	review_oa: z_Rating(),
	review_comp: z_Rating(),
	review_meaning: z_Rating(),
	tracks: z.array(z.string().regex(re__track__id)).min(1)
});

export const z__track = z.object({
	id: z.string().regex(re__track__id)
});

export const sql = createSqlTag({
	typeAliases: {
		tag: z__tag,
		track: z__track,
		track_cluster: z__track_cluster,
		void: z.object({}).strict()
	}
});
