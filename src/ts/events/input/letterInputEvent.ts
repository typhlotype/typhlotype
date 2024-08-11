import {Inner} from "../inner.js";

export class LetterInputEvent {
	letter: string;
	/** Whether the letter is correct. `null` if it was not checked for
		correctness (e.g. free-typing mode). */
	correct: boolean | null;

	static inner = new Inner<LetterInputEvent>();

	constructor(letters: string, correct: boolean | null) {
		this.letter = letters;
		this.correct = correct;
	}

	send() {
		LetterInputEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: LetterInputEvent) => void) {
		LetterInputEvent.inner.subscribe(subscriber);
	}
}


