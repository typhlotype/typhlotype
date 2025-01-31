import { BaseEvent } from "./baseEvent.js";
import { EventSubscriptionToken } from "./eventSubscriptionToken.js";

export class EventManager {
	counter = 0;
	subscribers: Record<number, EventSubscription> = {};

	/**
	 * Subscribe to events of a given type and its subtypes. It may be
	 * preferable to use the subscribe method on the given event type instead.
	 */
	subscribe<T>(eventType: any, subscriber: (e: T) => void): EventSubscriptionToken {
		const token = this.counter;
		this.counter++;
		this.subscribers[token] = {
			eventType,
			subscriber: subscriber as (e: BaseEvent) => void,
		};
		return new EventSubscriptionToken(token, this);
	}

	/**
	 * Remove the event subscription associated with the given token.
	 */
	unsubscribe(token: EventSubscriptionToken) {
		if (token.eventManager !== this) {
			throw new Error("Tried to unsubscribe with an event token from a different event manager.");
		}

		delete this.subscribers[token.identifier];
	}

	/**
	 * Send an event, causing all of its subscribers to be informed of it.
	 */
	send<T>(event: T) {
		for (const key in this.subscribers) {
			if (event instanceof this.subscribers[key].eventType) {
				this.subscribers[key].subscriber(event as BaseEvent);
			}
		}
	}
}

interface EventSubscription {
	eventType: any,
	subscriber: (e: BaseEvent) => void,
}

/**
 * The global event manager. See also `EventManager` and `BaseEvent`.
 */
export const gem = new EventManager();

