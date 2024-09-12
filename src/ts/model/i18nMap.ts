interface Map { [key: string]: any }

let map: Map = {};

export function setMap(newMap: Map, languageCode: string) {
	map = newMap;
	map.languageCode = languageCode;
}

export function i18n(keyPath: string): string {
	let res: any = map;
	for (const key of keyPath.split(".")) {
		res = res[key];

		if (res === undefined) {
			break;
		}
	}

	if (typeof res === "string") {
		return res;
	} else {
		console.warn("Unknown i18n key:", keyPath);
		return "(" + keyPath + ")";
	}
}

export function charMap(key: string): string {
	return map.charMap?.[key] ?? key;
}

export function phoneticSpellingAlphabet(key: string): string {
	return map.phoneticSpellingAlphabet?.[key];
}
