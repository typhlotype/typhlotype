import * as fs from "jsr:@std/fs";
import * as path from "jsr:@std/path";

export async function generateDynamicResourceIndices(targetDir: string) {
	await Promise.all([
		generateResourceIndex(targetDir, "words"),
		generateResourceIndex(targetDir, "translations"),
	]);
}

async function generateResourceIndex(targetDir: string, resourceIndexKind: string) {
	const dynamicResourcePath = path.join("data", resourceIndexKind);
	const dynamicResources = [];
	for await (const file of fs.walk(dynamicResourcePath)) {
		if (file.isFile) {
			const dynamicResource = JSON.parse(await Deno.readTextFile(file.path));
			if (dynamicResource.id + ".json" != path.relative(dynamicResourcePath, file.path).split(path.SEPARATOR).join('/')) {
				console.log("Dynamic resource of kind " + resourceIndexKind + " metadata ID is " + dynamicResource.id + ", but file name is " + file.path);
				throw new Error(`Dynamic resource id mismatch in ${file.path}`);
			}
			dynamicResources.push({id: dynamicResource.id, language: dynamicResource.language, name: dynamicResource.name});
		}
	}
	const collator = new Intl.Collator("en", { numeric: true });
	dynamicResources.sort((a, b) => collator.compare(a.name, b.name));
	await Deno.writeTextFile(path.join(targetDir, "data", resourceIndexKind, "index.json"), JSON.stringify(dynamicResources));
}
