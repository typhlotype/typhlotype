import { gem } from "./eventManager.js";
import { EventSubscriptionToken } from "./eventSubscriptionToken.js";

export class BaseEvent {
	/**
	 * Subscribe to events of this type and its subtypes.
	 *
	 * @param subscriber The function that will be called when a matching event
	 * is sent.
	 * @returns An object that can be used to unsubscribe later.
	 */
	static subscribe<T>(subscriber: (e: T) => void): EventSubscriptionToken {
		return gem.subscribe(this, subscriber);
	}

	/**
	 * Remove the event subscription associated with the given token.
	 *
	 * @deprecated Use `EventUnsubscribeToken.drop()` instead.
	 */
	static unsubscribe(token: EventSubscriptionToken) {
		return token.drop();
	}

	/**
	 * Send this event, causing all of the subscribers to events of this type
	 * and its parent types to be informed of it.
	 */
	send() {
		gem.send(this);
	}
}


