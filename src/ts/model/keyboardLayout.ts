import { KeyboardLayout } from "./model";

export class StandardKeyboardLayout implements KeyboardLayout {
	layout: [string, string, string];
	fingers = ["pinky", "ring finger", "middle finger", "index finger"];
	heights = ["above", null, "below"];
	leftHome = 3;
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

		let locationHint = columnSide + " " + this.fingers[columnFinger];

		if (this.heights[loc.row]) {
			locationHint += ", " + this.heights[loc.row];

			if (extendedFinger) {
				locationHint += " and ";
			}
		}

		if (extendedFinger) {
			switch (columnSide) {
				case "left":
					locationHint += " to the right";
					break;
				case "right":
					locationHint += " to the left";
					break;
			}
		}

		if (!extendedFinger && !this.heights[loc.row]) {
			locationHint += ", home key";
		}

		return locationHint;
	}

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

class Location {
	row: number;
	column: number;

	constructor(row: number, column: number) {
		this.row = row;
		this.column = column;
	}
}
