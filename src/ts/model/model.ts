import { charMap, i18n, phoneticSpellingAlphabet } from "./i18nMap.js";
import { AssertivePromptEvent } from "../events/textPrompt/assertivePromptEvent.js";
import { StateChangeEvent } from "../events/stateChangeEvent.js";
import { LetterPromptEvent } from "../events/activityPrompt/letterPromptEvent.js";
import { cancelDelayedPrompt, delayedPrompt } from "./delayedPrompt.js";
import { settings } from "./settingsModel.js";
import { RawLetterInputEvent } from "../events/input/rawLetterInputEvent.js";
import { CorrectLetterInputEvent } from "../events/input/correctLetterInputEvent.js";
import { IncorrectLetterInputEvent } from "../events/input/incorrectLetterInputEvent.js";
import { KeyboardLayout } from "./keyboardLayout.js";
import { WordGenerator } from "./wordGenerator.js";
import { Dropper } from "../droppable.js"
import { LetterSkippedEvent } from "../events/input/letterSkippedEvent.js";

/**
 * The Model class is responsible for managing the state and behavior of the
 * core, platform-independent parts of the application.
 *
 * It keeps track of the current word, position, keyboard layout, and word
 * generator. It also receives input events (from the `controller` module) and
 * generates events to communicate with the user (through the `ui` module).
 */
export class Model extends Dropper {
	/**
	 * The current word that the user should type, including correctly typed
	 * letters.
	 */
	word: string;
	/**
	 * The index in `word` of the next letter that the user should type.
	 */
	position: number;
	/**
	 * The keyboard layout to use for location hints.
	 */
	keyboardLayout: KeyboardLayout;
	/**
	 * The word generator to use to get new words.
	 */
	wordGenerator: WordGenerator;
	/**
	 * The time that the user was prompted to enter the current letter.
	 */
	promptTime?: HighResTimeStamp;
	/**
	 * Counts the number of times the space key has been pressed in a row, so
	 * that pressing space twice can be used to skip a letter.
	 */
	spaceCounter = 0;

	/**
	 * Creates a new Model instance.
	 *
	 * @param wordGenerator The word generator to use to get new words.
	 */
	constructor(wordGenerator: WordGenerator, keyboardLayout: KeyboardLayout) {
		super();

		this.position = 0;
		this.keyboardLayout = keyboardLayout;
		this.wordGenerator = wordGenerator;
		this.word = this.wordGenerator.getNextWord();

		this.addDroppable(RawLetterInputEvent.subscribe((e: RawLetterInputEvent) => this.letterInput(e)));
	}

	/**
	 * Returns the currently requested letter or symbol.
	 *
	 * @returns The requested letter.
	 */
	requestedLetter(): string {
		if (this.position < this.word.length) {
			return this.word.charAt(this.position);
		} else {
			return " ";
		}
	}

	/**
	 * Restarts the model.
	 */
	restart() {
		this.nextWord();
		this.prompt();
		new StateChangeEvent().send();
	}

	/**
	 * Generates a prompt for the currently requested letter, and emits an
	 * `AssertivePromptEvent` to prompt the user.
	 *
	 * @param prefix An optional prefix to add to the prompt.
	 */
	prompt(prefix?: string) {
		cancelDelayedPrompt("wordPromptHint");

		let promptText = "";

		if (prefix) {
			promptText += prefix + ". ";
		} else if (this.position == 0) {
			if (settings.keyPrompt.actionDescription) {
				promptText += i18n("prompt.type") + i18n(" ");
			}
			promptText += this.word + ". ";
		}

		const letter = this.requestedLetter();

		if (settings.keyPrompt.actionDescription) {
			promptText += i18n("prompt.press") + i18n(" ");
		}

		if (settings.keyPrompt.letter) {
			promptText += charMap(letter) + ". ";
		}

		if (settings.keyPrompt.phoneticSpellingAlphabet) {
			if (phoneticSpellingAlphabet(letter)) {
				promptText += phoneticSpellingAlphabet(letter) + ". ";
			}
		}

		// Send the prompt to the presentation layer
		this.promptTime = performance.now();
		new AssertivePromptEvent(promptText, "wordPrompt").send();
		new LetterPromptEvent(this.word, this.position).send();

		// Send the location hint as a delayed prompt
		if (settings.keyPrompt.locationAssistance) {
			const keyLocationHint = this.keyboardLayout.fingerLocationHint(letter);
			let promptHint: string;
			if (keyLocationHint) {
				promptHint = keyLocationHint + ". ";
			} else {
				promptHint = i18n("prompt.unknownLetter");
			}
			delayedPrompt(promptHint, letter, "wordPromptHint");
		}

	}

	/**
	 * Advances the position in the word, or moves to the next word if the
	 * current word has been completed.
	 */
	advanceLetter() {
		if (this.position < this.word.length) {
			this.position += 1;
		} else {
			this.nextWord();
		}

		new StateChangeEvent().send();
	}

	/**
	 * Handles a `LetterInputEvent` by determining whether it is correct and
	 * advancing to the next letter.
	 *
	 * Also emits a `CorrectLetterInputEvent`, an `IncorrectLetterInputEvent`,
	 * or a `LetterInputEvent` if correctness is not measured (for example in
	 * free typing mode).
	 *
	 * @param event The event to handle.
	 */
	letterInput(event: RawLetterInputEvent) {
		if (event.letter == this.requestedLetter()) {
			// Correct input
			const timeTaken = this.measureTimeTaken();
			this.spaceCounter = 0;
			this.advanceLetter();
			this.prompt();
			new CorrectLetterInputEvent(event.letter, timeTaken).send();
		} else if (event.letter == " ") {
			// Handle pressing space twice to skip letter.
			this.spaceCounter++;
			if (this.spaceCounter >= 2) {
				this.advanceLetter();
				this.prompt();
				new LetterSkippedEvent(event.letter).send();
				this.spaceCounter = 0;
			}
		} else {
			// Incorrect input
			this.spaceCounter = 0;
			this.prompt(i18n("prompt.incorrect"));
			new IncorrectLetterInputEvent(event.letter).send();
		}
	}

	/**
	 * Measures how much time has elapsed since `this.promptTime`.
	 *
	 * @returns The time elapsed since `this.promptTime`, or undefined if
	 * `this.promptTime` is undefined or in the future.
	 */
	measureTimeTaken(): HighResTimeStamp | undefined {
		const inputTime = performance.now();
		let timeTaken: HighResTimeStamp | undefined;
		if (this.promptTime && (this.promptTime < inputTime)) {
			timeTaken = inputTime - this.promptTime;
		}
		return timeTaken;
	}

	/**
	 * Advances to the next word in the model.
	 */
	nextWord() {
		this.word = this.wordGenerator.getNextWord();
		this.position = 0;
	}
}

/**
 * A time stamp in milliseconds, which may be fractional.
 */
export type HighResTimeStamp = number;
