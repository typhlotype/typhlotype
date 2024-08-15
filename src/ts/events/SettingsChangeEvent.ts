import {Inner} from "./inner.js";

export class SettingsChangeEvent {
	static inner = new Inner<SettingsChangeEvent>();

	send() {
		SettingsChangeEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: SettingsChangeEvent) => void) {
		SettingsChangeEvent.inner.subscribe(subscriber);
	}
}
