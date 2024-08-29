import { charMap, i18n, phoneticSpellingAlphabet } from "./i18nMap.js";
import { StandardKeyboardLayout } from "./keyboardLayout.js";
import { AssertivePromptEvent } from "../events/textPrompt/assertivePromptEvent.js";
import { StateChangeEvent } from "../events/StateChangeEvent.js";
import { LetterPromptEvent } from "../events/activityPrompt/letterPromptEvent.js";
import { RawLetterInputEvent } from "../events/input/rawLetterInputEvent.js";
import { cancelDelayedPrompt, delayedPrompt } from "./delayedPrompt.js";
import { settings } from "./settingsModel.js";
import { LetterInputEvent } from "../events/input/letterInputEvent.js";

export class Model {
	word: string;
	position: number;
	keyboardLayout: KeyboardLayout;
	wordGenerator: WordGenerator;

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

	requestedLetter() {
		if (this.position < this.word.length) {
			return this.word.charAt(this.position);
		} else {
			return " ";
		}
	}

	restart() {
		this.nextWord();
		this.prompt();
	}

	prompt(prefix?: string) {
		new LetterPromptEvent(this.requestedLetter()).send();
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
		};

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

	increment() {
		if (this.position < this.word.length) {
			this.position += 1;
		} else {
			this.nextWord();
		}
	}

	letterInput(event: RawLetterInputEvent) {
		if (event.letter == this.requestedLetter()) {
			this.increment();
			this.prompt();
			new LetterInputEvent(event.letter, 1).send();
		} else {
			this.prompt(i18n("prompt.incorrect"));
			new LetterInputEvent(event.letter, 0).send();
		}
	}

	nextWord() {
		this.word = this.wordGenerator.getNextWord();
		this.position = 0;
	}
}

export interface KeyboardLayout {
	fingerLocation(letter: string): string | undefined;
}

export interface WordGenerator {
	getNextWord(): string;
}
