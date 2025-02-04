import { BaseEvent } from "../baseEvent.js";
import { HighResTimeStamp } from "../../model/model.js"

export class LetterInputEvent extends BaseEvent {
	letter: string;
	timeTaken?: HighResTimeStamp;

	constructor(letter: string, timeTaken?: HighResTimeStamp) {
		super();

		this.letter = letter;
	}
}
