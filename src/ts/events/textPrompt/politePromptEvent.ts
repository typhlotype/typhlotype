import {Inner} from "../inner.js";

export class PolitePromptEvent {
	text: string;
	id: string | undefined;

	static inner = new Inner<PolitePromptEvent>();

	constructor(text: string, id?: string) {
		this.text = text;
		this.id = id;
	}

	send() {
		PolitePromptEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: PolitePromptEvent) => void) {
		PolitePromptEvent.inner.subscribe(subscriber);
	}
}


