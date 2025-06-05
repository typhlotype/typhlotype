export class KeystrokeHistogram {
	keystrokes: Map<string, Array<KeystrokeValue>> = new Map();

	/**
	 * Insert a keystroke into the histogram.
	 */
	insertKeystroke(letter: string, timeTaken: DOMHighResTimeStamp) {
		const keystroke = KeystrokeValue.now(timeTaken);

		if (!this.keystrokes.has(letter)) {
			this.keystrokes.set(letter, []);
		}

		this.keystrokes.get(letter)?.push(keystroke);
	}

	getWeigtedAverage() {
		// TODO
	}
}

class KeystrokeValue {
	/**
	 * The time it took for the user to press the key.
	 */
	timeTaken: DOMHighResTimeStamp;
	/**
	 * A weigting multiplier. This can for example be used if multiple
	 * KeystrokeValues have been coaleced into a single KeystrokeValue.
	 */
	weight = 1;

	constructor(timeTaken: DOMHighResTimeStamp, weight?: number) {
		this.timeTaken = timeTaken;

		if (weight) {
			this.weight = weight;
		}
	}

	/**
	 * Create a new KeystrokeValue instance with the current time as the
	 * `timeOccured`.
	 * @param timeTaken
	 * @returns
	 */
	static now(timeTaken: DOMHighResTimeStamp): KeystrokeValue {
		return new KeystrokeValue(timeTaken);
	}
}
