import {Inner} from "../inner.js";

export class RawLetterInputEvent {
	letter: string;

	static inner = new Inner<RawLetterInputEvent>();

	constructor(letters: string) {
		this.letter = letters;
	}

	send() {
		RawLetterInputEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: RawLetterInputEvent) => void) {
		RawLetterInputEvent.inner.subscribe(subscriber);
	}
}
