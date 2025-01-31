import { BaseEvent } from "../baseEvent.js";

export class IncorrectKeyPromptEvent extends BaseEvent {
	correctLetter: string;
	actualLetter: string;

	constructor(correctLetter: string, actualLetter: string) {
		super();

		this.correctLetter = correctLetter;
		this.actualLetter = actualLetter;
	}
}
