import {Inner} from "../inner.js";

export class DelayedHintFireEvent {
	letter: string;

	static inner = new Inner<DelayedHintFireEvent>();

	constructor(prompt: string, letter: string) {
		this.letter = letter;
	}

	send() {
		DelayedHintFireEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: DelayedHintFireEvent) => void) {
		DelayedHintFireEvent.inner.subscribe(subscriber);
	}
}


