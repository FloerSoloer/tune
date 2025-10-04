import { env } from '$env/dynamic/private';
import z from 'zod';
import { createPool, createSqlTag } from 'slonik';
import { createPgDriverFactory } from '@slonik/pg-driver';

export const pool = await createPool(
	`postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@localhost:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
	{
		driverFactory: createPgDriverFactory()
	}
);

const re_tag = /^[0-9a-z]([0-9a-z_]{0,30}[0-9a-z])?$/;

export const z__tag = z.object({
	cat: z.string().regex(re_tag),
	name: z.string().regex(re_tag)
});

export const sql = createSqlTag({
	typeAliases: {
		tag: z__tag,
		void: z.object({}).strict()
	}
});
