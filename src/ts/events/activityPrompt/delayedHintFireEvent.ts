import { BaseEvent } from "../baseEvent.js";

export class DelayedHintFireEvent extends BaseEvent {
	letter: string;

	constructor(prompt: string, letter: string) {
		super();

		this.letter = letter;
	}
}


