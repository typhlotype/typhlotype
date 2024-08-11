interface Map { [key: string]: any }

let map: Map = {};

export function setMap(newMap: any) {
	map = newMap;
}

export function i18n(key: string): string {
	console.warn("Unknown i18n key: ", key);
	return key;
}

export function charMap(key: string): string {
	return map.charMap?.[key] ?? key;
}

export function phoneticSpellingAlphabet(key: string): string {
	return map.phoneticSpellingAlphabet?.[key];
}
