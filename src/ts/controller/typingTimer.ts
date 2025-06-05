import { CorrectLetterInputEvent } from "../events/input/correctLetterInputEvent.js";
import { Module } from "../module.js";

export class TypingTimer implements Module {
	constructor() {
		CorrectLetterInputEvent.subscribe(
			(e: CorrectLetterInputEvent) => {this.recordInput(e)}
		);
	}

	recordInput(e: CorrectLetterInputEvent) {
		console.log("Recorded input", e.letter, e.timeTaken);
	}

	initialize(): void {

	}

	drop(): void {

	}
}
