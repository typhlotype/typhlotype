import { BaseEvent } from "../baseEvent.js";

export class DelayedHintFireEvent extends BaseEvent {
	letter: string;

	constructor(letter: string) {
		super();

		this.letter = letter;
	}
}


