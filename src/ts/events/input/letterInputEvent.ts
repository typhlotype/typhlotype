import { BaseEvent } from "../baseEvent.js";

export class LetterInputEvent extends BaseEvent {
	letters: string;
	/** Whether the letter is correct. `null` if it was not checked for
		correctness (e.g. free-typing mode). */
	correctUntil: number | null;

	constructor(letters: string, correctUntil: number | null) {
		super();

		this.letters = letters;
		this.correctUntil = correctUntil;
	}
}


