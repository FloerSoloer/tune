type TQueueNode<T> = {
	data: T;
	next?: TQueueNode<T>;
};
export function Queue<T>() {
	let head: TQueueNode<T> | undefined;
	let tail: TQueueNode<T> | undefined;

	function push(data: T) {
		const node = { data };
		if (typeof head === 'undefined') head = node;
		if (typeof tail !== 'undefined') tail.next = node;
		tail = node;
	}
	function pop() {
		const prev = head;
		if (typeof prev !== 'undefined') {
			if ('next' in prev) head = prev.next;
			else head = tail = undefined;
			return prev.data;
		}
	}
	return { push, pop };
}
