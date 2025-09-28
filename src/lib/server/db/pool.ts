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

export const sql = createSqlTag({
	typeAliases: {
		tag: z.object({
			name: z.string(),
			cat: z.string()
		})
	}
});
