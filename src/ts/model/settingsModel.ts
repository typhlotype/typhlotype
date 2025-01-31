import { SettingsChangeEvent } from "../events/settingsChangeEvent.js";

export class Settings {
	language = {
		interfaceLanguage: undefined as string | undefined,
		wordSetLanguage: "en" as string | undefined,
		wordSetVariant: "1000" as string | undefined,
	};
	input = {
		layoutRegion: "basic" as string | undefined,
		layoutVariant: "qwerty",
		angleMod: "straight" as "left" | "right" | "straight",
	};
	keyPrompt = {
		actionDescription: true,
		letter: true,
		phoneticSpellingAlphabet: false,
		locationAssistance: true,
	};
	promptSpeechMethods = {
		live: true,
		label: false,
		speech: false,
	};

	constructor() {}

	repair() {
		if (!this.input.layoutRegion) {
			this.input.layoutRegion = "basic";
		}
	}
}

export let settings = new Settings();

export function applySettings(newSettings: Partial<Settings>, event=true) {
	mergeObjects(settings, newSettings);
	settings.repair();

	if (event) {
		new SettingsChangeEvent().send();
	}
}

/**
 * Apply the values of object b into object a in place.
 */
function mergeObjects(a: any, b: any) {
	for (const key in b) {
		if (typeof(b[key]) === "object" && typeof(a[key]) === "object") {
			mergeObjects(a[key], b[key]);
		} else {
			a[key] = b[key];
		}
	}
}

type promptPart = "actionDescription" | "letter" | "phoneticSpellingAlphabet" | "word" | "wordSpelled" | "absoluteKeyPosition" | "relativeKeyPosition";

