import {Inner} from "../inner.js";

export class AssertivePromptEvent {
	text: string;
	id: string | undefined;

	static inner = new Inner<AssertivePromptEvent>();

	constructor(text: string, id?: string) {
		this.text = text;
		this.id = id;
	}

	send() {
		AssertivePromptEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: AssertivePromptEvent) => void) {
		AssertivePromptEvent.inner.subscribe(subscriber);
	}
}


