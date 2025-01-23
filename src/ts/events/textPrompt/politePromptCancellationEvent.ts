import {Inner} from "../inner.js";

export class PolitePromptCancellationEvent {
	id: string;

	static inner = new Inner<PolitePromptCancellationEvent>();

	constructor(id: string) {
		this.id = id;
	}

	send() {
		PolitePromptCancellationEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: PolitePromptCancellationEvent) => void) {
		PolitePromptCancellationEvent.inner.subscribe(subscriber);
	}
}

