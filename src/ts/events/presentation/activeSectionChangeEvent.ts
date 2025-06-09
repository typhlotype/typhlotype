import { BaseEvent } from "../baseEvent.js";

/**
 * Informs that the active (displayed) section of the application has changed,
 * and that any other section has been hidden.
 */
export class ActiveSectionChangeEvent extends BaseEvent {
	newSectionSelector: string;

	constructor(newSectionSelector: string) {
		super();

		this.newSectionSelector = newSectionSelector;
	}
}
