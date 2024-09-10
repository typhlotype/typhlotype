import { charMap, i18n, phoneticSpellingAlphabet } from "./i18nMap.js";
import { StandardKeyboardLayout } from "./keyboardLayouts/standardKeyboardLayout.js";
import { AssertivePromptEvent } from "../events/textPrompt/assertivePromptEvent.js";
import { StateChangeEvent } from "../events/StateChangeEvent.js";
import { LetterPromptEvent } from "../events/activityPrompt/letterPromptEvent.js";
import { RawLetterInputEvent } from "../events/input/rawLetterInputEvent.js";
import { cancelDelayedPrompt, delayedPrompt } from "./delayedPrompt.js";
import { settings } from "./settingsModel.js";
import { LetterInputEvent } from "../events/input/letterInputEvent.js";
import { KeyboardLayout } from "./keyboardLayout.js";
import { WordGenerator } from "./wordGenerator.js";

/**
 * The Model class is responsible for managing the state and behavior of the
 * core, platform-independent parts of the application.
 *
 * It keeps track of the current word, position, keyboard layout, and word
 * generator. It also receives input events (from the `controller` module) and
 * generates events to communicate with the user (through the `ui` module).
 */
export class Model {
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
	 * Creates a new Model instance.
	 *
	 * @param wordGenerator The word generator to use to get new words.
	 */
	constructor(wordGenerator: WordGenerator) {
		this.position = 0;
		this.keyboardLayout = new StandardKeyboardLayout([
			"QWERTYUIOP",
			"ASDFGHJKL",
			"ZXCVBNM"
		]);
		this.wordGenerator = wordGenerator;
		this.word = this.wordGenerator.getNextWord();

		RawLetterInputEvent.subscribe((e) => this.letterInput(e));
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
	}

	/**
	 * Generates a prompt for the currently requested letter, and emits an
	 * `AssertivePromptEvent` to prompt the ures.
	 *
	 * @param prefix An optional prefix to add to the prompt.
	 */
	prompt(prefix?: string) {
		new LetterPromptEvent(this.word, this.position).send();
		new StateChangeEvent().send();

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
			if (phoneticSpellingAlphabet(letter) !== undefined) {
				promptText += phoneticSpellingAlphabet(letter) + ". ";
			}
		}

		new AssertivePromptEvent(promptText, "wordPrompt").send();

		let keyLocationHint = this.keyboardLayout.fingerLocation(letter);
		if (keyLocationHint) {
			delayedPrompt(keyLocationHint + ". ",  "wordPromptHint");
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
	}

	/**
	 * Handles a `RawLetterInputEvent` by advancing to the next letter and
	 * emitting a `LetterInputEvent`.
	 *
	 * @param event The event to handle.
	 */
	letterInput(event: RawLetterInputEvent) {
		if (event.letter == this.requestedLetter()) {
			this.advanceLetter();
			this.prompt();
			new LetterInputEvent(event.letter, 1).send();
		} else {
			this.prompt(i18n("prompt.incorrect"));
			new LetterInputEvent(event.letter, 0).send();
		}
	}

	/**
	 * Advances to the next word in the model.
	 */
	nextWord() {
		this.word = this.wordGenerator.getNextWord();
		this.position = 0;
	}
}



