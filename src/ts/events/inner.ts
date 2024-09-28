import { EventUnsubscribeToken } from './event.js';
export { EventUnsubscribeToken } from './event.js';


export class Inner<T> {
	subscribers: Record<string, ((e: T) => void)> = {};
	counter = 0;

	send(event: T) {
		for (const key in this.subscribers) {
			const ret = this.subscribers[key](event);
		}
	}

	subscribe(subscriber: (e: T) => void): EventUnsubscribeToken {
		const token = this.counter;
		this.counter++;
		this.subscribers[token] = subscriber;
		return token;
	}

	unsubscribe(token: EventUnsubscribeToken) {
		delete this.subscribers[token];
	}
}

