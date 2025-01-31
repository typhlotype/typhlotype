import { EventManager } from "./eventManager";

export class EventSubscriptionToken {
	identifier: number;
	eventManager: EventManager;

	constructor(identifier: number, eventManager: EventManager) {
		this.identifier = identifier;
		this.eventManager = eventManager;
	}

	/**
	 * Remove the associated event subscription. The subscriber will no longer
	 * be informed 
	 */
	drop() {
		this.eventManager.unsubscribe(this);
	}
}
