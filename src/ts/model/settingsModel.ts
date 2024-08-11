export class Settings {
	language = {
		interfaceLanguage: "en",
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
	promptSpeech = {
		live: true,
		label: false,
		speech: false,
	};

	constructor() {}
}

export const settings = new Settings();



type promptPart = "actionDescription" | "letter" | "phoneticSpellingAlphabet" | "word" | "wordSpelled" | "absoluteKeyPosition" | "relativeKeyPosition";
