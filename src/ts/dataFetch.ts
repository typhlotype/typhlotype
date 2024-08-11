export async function get(path: string) {
	let res = await fetch("../data/" + path);
	let data = await res.json();
	return data;
}
