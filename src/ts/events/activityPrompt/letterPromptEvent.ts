import { BaseEvent } from "../baseEvent.js";

export class LetterPromptEvent extends BaseEvent {
	letter: string;
	word: string;
	wordPosition: number;

	constructor(word: string, wordPosition: number) {
		super();

		this.word = word;
		this.wordPosition = wordPosition;
		this.letter = word[wordPosition];
	}
}
