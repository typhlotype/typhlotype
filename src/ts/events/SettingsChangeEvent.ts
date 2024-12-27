import {Inner} from "./inner";

export class SettingsChangeEvent {
	static inner = new Inner<SettingsChangeEvent>();

	send() {
		SettingsChangeEvent.inner.send(this);
	}

	static subscribe(subscriber: (e: SettingsChangeEvent) => void) {
		SettingsChangeEvent.inner.subscribe(subscriber);
	}
}
