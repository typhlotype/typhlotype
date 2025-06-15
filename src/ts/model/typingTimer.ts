import { CorrectLetterInputEvent } from "../events/input/correctLetterInputEvent.js";
import { Module } from "../module.js";
import { KeystrokeHistogram } from "./keystrokeHistogram.js";
import * as persistance from "../controller/persistance.js";

export class TypingTimer implements Module {
	keystrokeHistogram = new KeystrokeHistogram();

	constructor() {

	}

	recordInput(e: CorrectLetterInputEvent) {
		if (e.timeTaken !== undefined) {
			this.keystrokeHistogram.insertKeystroke(e.letter, e.timeTaken);
		}
	}

	initialize(): void {
		// TODO #23 Read from persistant storage
		CorrectLetterInputEvent.subscribe(
			(e: CorrectLetterInputEvent) => {this.recordInput(e)}
		);
	}

	drop(): void {
		// TODO #23 Save to persistant storage
	}
}
