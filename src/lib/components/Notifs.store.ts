import { writable } from 'svelte/store';
import { Queue } from './Queue';

type TNotifParams = {
	title?: string;
	/**
	 * @default 3000
	 */
	timeout_ms?: number;
};

type TNotif = {
	/**
	 * autoincremented id
	 */
	id: number;
	timeout_id?: number;
} & TNotifParams;

function Store(max_len = 5, default_timeout_ms = 5000) {
	let next_id = 0;
	const record: Record<number, TNotif> = {};
	const q = Queue<number>();
	const curr = writable<TNotif[]>([]);

	function push(data: TNotifParams) {
		const id = next_id++;
		record[id] = { ...data, id };
		q.push(id);
		curr.update(function ($curr) {
			if ($curr.length < max_len) $curr = pop($curr);
			return $curr;
		});
	}

	function pop($curr: TNotif[]) {
		const id = q.pop();
		if (typeof id === 'undefined') return $curr;
		$curr = [record[id], ...$curr];
		startTimeout(id);
		return $curr;
	}

	function startTimeout(id: number) {
		record[id].timeout_id = setTimeout(function () {
			curr.update(function ($curr) {
				$curr = $curr.filter(function (notif) {
					return notif.id !== id;
				});

				delete record[id];
				$curr = pop($curr);

				return $curr;
			});
		}, record[id].timeout_ms ?? default_timeout_ms);
	}

	return {
		subscribe: curr.subscribe,
		push
	};
}

export const notifs = Store();
