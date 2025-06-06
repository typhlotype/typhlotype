import { CorrectLetterInputEvent } from "../events/input/correctLetterInputEvent.js";
import { Module } from "../module.js";

export class TypingTimer implements Module {
	constructor() {
		CorrectLetterInputEvent.subscribe(
			(e: CorrectLetterInputEvent) => {this.recordInput(e)}
		);
	}

	recordInput(e: CorrectLetterInputEvent) {
		// TODO #23
	}

	initialize(): void {

	}

	drop(): void {

	}
}
