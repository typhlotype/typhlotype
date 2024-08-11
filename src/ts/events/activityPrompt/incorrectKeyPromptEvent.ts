import {Inner} from "../inner.js";

export class IncorrectKeyPromptEvent {
	correctLetter: string;
	actualLetter: string;

	static inner = new Inner<IncorrectKeyPromptEvent>();

	constructor(correctLetter: string, actualLetter: string) {
		this.correctLetter = correctLetter;
		this.actualLetter = actualLetter;
	}

	send() {
		IncorrectKeyPromptEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: IncorrectKeyPromptEvent) => void) {
		IncorrectKeyPromptEvent.inner.subscribe(subscriber);
	}
}
