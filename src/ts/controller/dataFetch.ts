/**
 * Fetches data from the specified path.
 *
 * @param path The path to the data, relative to the `data` directory.
 * @returns A promise that resolves to the fetched data.
 */
export async function get(path: string) {
	let res = await fetch("../data/" + path);
	if (!res.ok) {
		throw new Error(`Failed to fetch data at ${path}: ${res.status} ${res.statusText}`);
	}
	let data = await res.json();
	return data;
}
