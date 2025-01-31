import { BaseEvent } from "../baseEvent.js";

export class RawLetterInputEvent extends BaseEvent {
	letter: string;

	constructor(letters: string) {
		super();

		this.letter = letters;
	}
}
