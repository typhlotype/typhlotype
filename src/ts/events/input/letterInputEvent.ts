import {Inner} from "../inner.js";

export class LetterInputEvent {
	letters: string;
	/** Whether the letter is correct. `null` if it was not checked for
		correctness (e.g. free-typing mode). */
	correctUntil: number | null;

	static inner = new Inner<LetterInputEvent>();

	constructor(letters: string, correctUntil: number | null) {
		this.letters = letters;
		this.correctUntil = correctUntil;
	}

	send() {
		LetterInputEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: LetterInputEvent) => void) {
		LetterInputEvent.inner.subscribe(subscriber);
	}
}


