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
	 * A hint should be returned for every letter that it is possible to enter
	 * with this keyboard layout.
	 *
	 * @param letter The letter to get the location hint for.
	 * @returns The location hint, or `undefined` if no hint is available. Note
	 * that `undefined` may be returned even if it is possible for the user to
	 * enter the letter with this keyboard layout.
	 * @see contains(string)
	 */
	fingerLocationHint(letter: string): string | undefined;

	/**
	 * Checks whether it is possible for the user to enter the given letter with
	 * this keyboard layout.
	 *
	 * @returns Whether it is possible for the user to enter the given letter
	 * with this keyboard layout
	 * @see fingerLocationHint(string)
	 */
	contains(letter: string): boolean;
}
