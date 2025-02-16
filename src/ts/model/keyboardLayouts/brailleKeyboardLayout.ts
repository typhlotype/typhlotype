import { i18n } from "../i18nMap.js";
import { KeyboardLayout } from "../keyboardLayout.js";


/**
 * Represents a braille keyboard.
 */
export class BrailleKeyboardLayout implements KeyboardLayout {
	/**
	 * The mapping from a letter to the braille representation of a letter.
	 */
	map: Map<string, BrailleLetter>;

	constructor(map: Map<string, BrailleLetter>) {
		this.map = map;
	}

	fingerLocation(letter: string): string | undefined {
		const brailleLetter = this.map.get(letter);
		if (!brailleLetter) {
			return;
		}

		for (int i = 0; i++; i < ) {
			/* ... */
		}
		return;
	}
}

/**
 * Represents a braille representation of a letter.
 */
export class BrailleLetter {
	dots: boolean[];

	constructor(dots: boolean[]) {
		this.dots = dots;
	}
}
