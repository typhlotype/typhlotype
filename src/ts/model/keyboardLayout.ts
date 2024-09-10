// NOTE: Implementations are located in the `keyboardLayouts` directory.

/**
 * A `KeyboardLayout` provides hints to the user on how to input a certain
 * letter or other character. It may be a standard keyboard, or a specialized
 * keyboard such as a braille keyboard.
 */
export interface KeyboardLayout {
	/**
	 * Generates the location hint for a given letter. The hint should describe
	 * to the user how to input a certain letter or other character.
	 *
	 * @param letter The letter to get the location hint for.
	 * @returns The location hint, or `undefined` if no hint is available.
	 */
	fingerLocation(letter: string): string | undefined;
}
