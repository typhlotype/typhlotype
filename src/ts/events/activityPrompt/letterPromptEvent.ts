import {Inner} from "../inner.js";

export class LetterPromptEvent {
	letter: string;
	word: string;
	wordPosition: number;

	static inner = new Inner<LetterPromptEvent>();

	constructor(word: string, wordPosition: number) {
		this.word = word;
		this.wordPosition = wordPosition;
		this.letter = word[wordPosition];
	}

	send() {
		LetterPromptEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: LetterPromptEvent) => void) {
		LetterPromptEvent.inner.subscribe(subscriber);
	}
}
