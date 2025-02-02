import { BaseEvent } from "../baseEvent.js";

export class LetterInputEvent extends BaseEvent {
	letter: string;
	timeTaken?: DOMHighResTimeStamp;

	constructor(letter: string, timeTaken?: DOMHighResTimeStamp) {
		super();

		this.letter = letter;
	}
}
