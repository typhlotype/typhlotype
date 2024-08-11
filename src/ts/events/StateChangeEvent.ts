import {Inner} from "./inner.js";

export class StateChangeEvent {
	static inner = new Inner<StateChangeEvent>();

	send() {
		StateChangeEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: StateChangeEvent) => void) {
		StateChangeEvent.inner.subscribe(subscriber);
	}
}
