#!/usr/bin/env -S deno run --allow-all

// Flags:
// --watch: Watch for changes and rebuild.
// --serve: Build and host a local development server. Implies --watch.
// --deploy: Deploy the built files.

import * as fs from "jsr:@std/fs";
import * as path from "jsr:@std/path";
import * as cli from "jsr:@std/cli";
import * as clispinner from "jsr:@std/cli/unstable-spinner";
import * as http from "jsr:@std/http";
import { generateDynamicResourceIndices } from "./build/indexGeneration.ts";

const targetDir = "target";

let buildLock = false;
let modifiedAfterBuild = false;
const args = cli.parseArgs(Deno.args, { "boolean": ["watch", "serve", "deploy"] });

async function build() {
	buildLock = true;
	const spinner = new clispinner.Spinner();
	spinner.message = "Building...";
	spinner.start();

	try {
		fs.emptyDir(targetDir);
		spinner.message = "Compiling TypeScript...";
		await tscBuild();
		spinner.message = "Copying static files...";
		await copyFiles();
		spinner.message = "Generating resource indices...";
		await generateDynamicResourceIndices(targetDir);
	} catch (e) {
		spinner.stop();
		buildLock = false;
		console.error(`Build error: ${e instanceof Error ? e.message : typeof e}. See above for log information.`);
		return false;
	}

	spinner.stop();
	console.log("Built successfully");

	if (modifiedAfterBuild) {
		modifiedAfterBuild = false;
		build();
	}

	buildLock = false;

	return true;
}

async function tscBuild() {
	const tsc = new Deno.Command("tsc", {args: ["--outDir", path.join(targetDir, "js"), "--pretty", "true"], stdout: "inherit", stderr: "inherit"});
	const tscResult = await tsc.output();
	if (!tscResult.success) {
		throw new Error("TypeScript compilation failed");
	}
}

async function copyFiles() {
	await fs.copy(path.join("data"), path.join(targetDir, "data"));
	await fs.copy(path.join("src", "index.html"), path.join(targetDir, "index.html"));
	await fs.copy(path.join("src", "main.css"), path.join(targetDir, "main.css"));
	await fs.copy(path.join("static"), path.join(targetDir, "static"));

	await Deno.mkdir(path.join(targetDir, "src"));
	await fs.copy(path.join("src", "ts"), path.join(targetDir, "src", "ts"));
}

async function watch() {
	const watcher = Deno.watchFs(["src", "data", "static"]);

	for await (const event of watcher) {
		if (event.kind === "access") {
			continue;
		}
		if (!buildLock) {
			build();
		} else {
			modifiedAfterBuild = true;
		}
	}

}

const result = await build();

if (args.serve) {
	Deno.serve((req) => {
		return http.serveDir(req, {
			fsRoot: "target",
		});
	});
}

if (args.deploy && result) {
	const deployTarget = await Deno.readTextFile("env/deploy_target");
	const deployCommand = new Deno.Command("rsync", {args: ["-av", "--delete", "target/", deployTarget], stdout: "inherit", stderr: "inherit"});
	const deployCommandResult = await deployCommand.output();
	if (!deployCommandResult.success) {
		Deno.exit(2);
	}
}

if ((args.watch || args.serve) && !args.deploy) {
	watch();
} else {
	Deno.exit(result ? 0 : 1);
}
