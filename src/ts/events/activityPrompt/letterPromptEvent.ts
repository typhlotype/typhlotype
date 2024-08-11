import {Inner} from "../inner.js";

export class LetterPromptEvent {
	letter: string;

	static inner = new Inner<LetterPromptEvent>();

	constructor(letter: string) {
		this.letter = letter;
	}

	send() {
		LetterPromptEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: LetterPromptEvent) => void) {
		LetterPromptEvent.inner.subscribe(subscriber);
	}
}


