import { ErrorWithNotif, type TNotifParams } from './components/Notifs.store';

type THandler = (e: any) => false | TNotifParams;

export function parseErrorNotif(prefix: string, e: any, handler?: THandler) {
	if (e instanceof ErrorWithNotif) {
		if (e.message) console.error(e.message);
		return e.data;
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
