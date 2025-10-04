import { ZodError } from 'zod';
import { ErrorWithNotif, type TNotifParams } from './components/Notifs.store';

type THandler = (e: any) => false | TNotifParams;

export function parseErrorNotif(prefix: string, e: any, handler?: THandler) {
	if (e instanceof ErrorWithNotif) {
		if (e.message) console.error(e.message);
		return e.data;
	}
	if (e instanceof ZodError) {
		const data: TNotifParams = { title: 'Invalid fields' };
		const invalid_fields = new Set();
		for (const issue of e.issues) for (const field of issue.path) invalid_fields.add(field);
		if (invalid_fields.size > 0) data.msg = Array.from(invalid_fields).toSorted().join(', ');
		// No invalid_fields is unexpected...
		else console.error(prefix, e);
		return data;
	}

	if (typeof handler !== 'undefined')
		try {
			const data = handler(e);
			if (data !== false) return data;
		} catch (e) {
			console.error(prefix, 'handler', e);
			// don't return, parse like default
		}

	// default handler
	console.error(prefix, e);
	const data = { title: 'Error' };
	return data;
}
