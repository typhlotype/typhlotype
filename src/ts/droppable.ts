export interface Drop {
	drop(): void,
}

export abstract class Dropper {
	/**
	 * Objects on which `drop()` should be called when this object is dropped.
	 */
	drops: Drop[] = [];

	addDroppable(drop: Drop) {
		this.drops.push(drop);
	}

	drop() {
		for (const token of this.drops) {
			token.drop();
		}
	}
}
