/**
 * Returns the current value associated with the given key, or null if the given key does not exist.
 */
export function getItem(key: string): string | null {
	return localStorage.getItem(key);
}

/**
 * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
 * Throws an exception if the new value couldn't be set.
 */
export function setItem(key: string, value: string) {
	return localStorage.setItem(key, value);
}

