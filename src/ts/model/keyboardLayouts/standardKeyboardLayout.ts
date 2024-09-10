import { i18n } from "./i18nMap.js";
import { KeyboardLayout } from "./keyboardLayout.js";


/**
 * Represents a keyboard layout where each letter has its own key.
 */
export class StandardKeyboardLayout implements KeyboardLayout {
	/**
	 * Represents the layout of a keyboard.
	 */
	layout: [string, string, string];
	/**
	 * The internal names of fingers.
	 */
	fingers = ["pinky", "ringFinger", "middleFinger", "indexFinger"];
	/**
	 * The internal names of heights, i.e. above or below. `null` means the home
	 * row.
	 */
	heights = ["above", null, "below"];
	/**
	 * The column number of the left home key (F on a QWERTY keyboard).
	 */
	leftHome = 3;
	/**
	 * The column number of the right home key (J on a QWERTY keyboard).
	 */
	rightHome = 6;

	constructor(layout: [string, string, string]) {
		this.layout = layout;
	}

	fingerLocation(letter: string): string | undefined {
		let loc = this.searchForLetter(letter);

		if (!loc) {
			console.warn("Could not locate letter '" + letter + "' in keyboard layout. Skipping location hint.");
			return;
		}

		let columnSide: "left" | "right";
		let columnFinger: number;
		if (loc.column >= this.leftHome - 3 && loc.column <= this.leftHome + 1) {
			// left side of keyboard
			columnSide = "left";
			columnFinger = loc.column + this.leftHome - 3;
		} else if (loc.column >= this.rightHome - 1 && loc.column <= this.rightHome + 3) {
			// right side of keyboard
			columnSide = "right";
			columnFinger = this.rightHome + 3 - loc.column;
		} else {
			console.warn("Key", letter, loc, "not in hand-reachable area. Skipping location hint.");
			return;
		}

		let extendedFinger = false;
		if (columnFinger == 4) {
			columnFinger = 3;
			extendedFinger = true;
		}

		let locationHint = i18n("prompt.keyboard." + columnSide) + i18n(" ") + i18n("prompt.keyboard." + this.fingers[columnFinger]);

		const rowHeight = this.heights[loc.row];
		if (rowHeight) {
			locationHint += "," + i18n(" ") + i18n("prompt.keyboard." + rowHeight);

			if (extendedFinger) {
				locationHint += i18n(" ") + i18n("prompt.keyboard.and") + i18n(" ");
			}
		}

		if (extendedFinger) {
			switch (columnSide) {
				case "left":
					locationHint += i18n(" ") + i18n("prompt.keyboard.toTheRight");
					break;
				case "right":
					locationHint += i18n(" ") + i18n("prompt.keyboard.toTheLeft");
					break;
			}
		}

		if (!extendedFinger && !this.heights[loc.row]) {
			locationHint += "," + i18n(" ") + i18n("prompt.keyboard.homeRow");
		}

		return locationHint;
	}

	/**
	 * Searches for a letter in the layout.
	 *
	 * @param letter The letter to search for.
	 * @returns The location of the letter in the layout, or `undefined` if the
	 * letter is not found.
	 */
	searchForLetter(letter: string): Location | undefined {
		for (let r = 0; r < this.layout.length; r++) {
			for (let c = 0; c < this.layout[r].length; c++) {
				if (letter.toLowerCase() === this.layout[r][c].toLowerCase()) {
					return new Location(r, c);
				}
			}
		}
		return;
	}
}

/**
 * Represents a location in a `StandardKeyboardLayout`. The value depends on the
 * internal representation in the given `StandardKeyboardLayout`, and may thus
 * not portable between different instances of `StandardKeyboardLayout`.
 */
class Location {	row: number;
	column: number;

	constructor(row: number, column: number) {
		this.row = row;
		this.column = column;
	}
}
