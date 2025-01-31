import { BaseEvent } from "../baseEvent.js";

export class PolitePromptCancellationEvent extends BaseEvent {
	id: string;

	constructor(id: string) {
		super();

		this.id = id;
	}
}

