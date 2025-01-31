import { BaseEvent } from "../baseEvent.js";

export class PromptEvent extends BaseEvent {
	text: string;
	id: string | undefined;

	constructor(text: string, id?: string) {
		super();

		this.text = text;
		this.id = id;
	}
}


