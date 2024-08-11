export class Inner<T> {
	subscribers: ((e: T) => void)[] = [];

	send(event: T) {
		for (const subscriber of this.subscribers) {
			subscriber(event);
		}
	}

	subscribe(subscriber: (e: T) => void) {
		this.subscribers.push(subscriber);
	}
}
