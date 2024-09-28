import { Inner, EventUnsubscribeToken } from "../inner.js";

export class RawLetterInputEvent {
	letter: string;

	static inner = new Inner<RawLetterInputEvent>();

	constructor(letters: string) {
		this.letter = letters;
	}

	send() {
		RawLetterInputEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: RawLetterInputEvent) => void): EventUnsubscribeToken {
		return RawLetterInputEvent.inner.subscribe(subscriber);
	}

	static unsubscribe(token: number) {
		RawLetterInputEvent.inner.unsubscribe(token);
	}
}
