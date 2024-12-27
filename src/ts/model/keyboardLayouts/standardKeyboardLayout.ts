import { i18n } from "../i18nMap";
import { KeyboardLayout } from "../keyboardLayout";


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
		const loc = this.searchForLetter(letter);

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
		} else if (loc.column >= this.rightHome - 1 && loc.column <= this.rightHome + 4) {
			// right side of keyboard
			columnSide = "right";
			columnFinger = this.rightHome + 3 - loc.column;
		} else {
			console.warn("Key", letter, loc, "not in hand-reachable area. Skipping location hint.");
			return;
		}

		let extendedFinger = RelativeDirection.None;
		if (columnFinger == 4) {
			columnFinger = 3;
			extendedFinger = RelativeDirection.TowardsCenter;
		} else if (columnFinger == -1) {
			columnFinger = 0;
			extendedFinger = RelativeDirection.TowardsEdge;
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
			switch (relativeDirectionToDirection(extendedFinger, columnSide)) {
				case "left":
					locationHint += i18n(" ") + i18n("prompt.keyboard.toTheRight");
					break;
				case "right":
					locationHint += i18n(" ") + i18n("prompt.keyboard.toTheLeft");
					break;
				default:
					console.warn("Extended finger with no direction", extendedFinger, columnSide);
					return;
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
class Location {
	row: number;
	column: number;

	constructor(row: number, column: number) {
		this.row = row;
		this.column = column;
	}
}

enum RelativeDirection {
	None = 0,
	TowardsCenter = 1,
	TowardsEdge = 2,
}

function relativeDirectionToDirection(efd: RelativeDirection, columnSide: "left" | "right"): "left" | "right" | undefined {
	const None = RelativeDirection.None;
	const TowardsCenter = RelativeDirection.TowardsCenter;
	const TowardsEdge = RelativeDirection.TowardsEdge;
	if (
		(efd == TowardsCenter && columnSide == "left")
		|| (efd == TowardsEdge && columnSide == "right")
	) {
		return "right";
	} else if (
		(efd == TowardsCenter && columnSide == "right")
		|| (efd == TowardsEdge && columnSide == "left")
	) {
		return "left";
	} else if (efd == None) {
		return;
	} else {
		throw new Error("Unreachable");
	}
}
