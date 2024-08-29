import { SettingsChangeEvent } from "../events/SettingsChangeEvent.js";

export class Settings {
	language = {
		interfaceLanguage: "en" as string | undefined,
		wordSetLanguage: "en" as string | undefined,
		wordSet: "200" as string | undefined,
	};
	input = {
		layoutRegion: "universal",
		layoutVariant: "qwerty",
		angleMod: "right" as "left" | "right" | "straight",
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
	mergeObjects(settings, newSettings);

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

