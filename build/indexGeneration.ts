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
			const indexObject = new IndexObject(dynamicResource);
			dynamicResources.push(indexObject);
		}
	}
	const collator = new Intl.Collator("en", { numeric: true });
	dynamicResources.sort((a, b) => collator.compare(a.name, b.name));
	await Deno.writeTextFile(path.join(targetDir, "data", resourceIndexKind, "index.json"), JSON.stringify(dynamicResources));
}

class IndexObject {
	id: string;
	language: string;
	name: string;
	defaultForLanguage?: true;
	languageName?: string;

	constructor(resource: {id: string, language: string, name: string, default?: true, language_name?: string}) {
		this.id = resource.id;
		this.language = resource.language;
		this.name = resource.name;
		this.defaultForLanguage = resource.default;
		this.languageName = resource.language_name;
	}
}
