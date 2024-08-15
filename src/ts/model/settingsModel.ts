import { SettingsChangeEvent } from "../events/SettingsChangeEvent.js";

export class Settings {
	language = {
		interfaceLanguage: "en" as string | undefined,
	};
	input = {
		layoutRegion: "universal",
		layoutVariant: "qwerty",
		angleMod: "traditional" as "traditional" | "ergonomic",
	};
	keyPrompt = {
		actionDescription: true,
		letter: true,
		phoneticSpellingAlphabet: false,
		locationAssistance: false,
	};
	promptSpeechMethods = {
		live: true,
		label: false,
		speech: false,
	};

	constructor() {}
}

export let settings = new Settings();

export function applySettings(newSettings: Partial<Settings>, event=true) {
	settings = {...settings, ...newSettings};

	if (event) {
		new SettingsChangeEvent().send();
	}
}

type promptPart = "actionDescription" | "letter" | "phoneticSpellingAlphabet" | "word" | "wordSpelled" | "absoluteKeyPosition" | "relativeKeyPosition";
