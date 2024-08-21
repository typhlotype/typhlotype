#!/usr/bin/env -S deno run --allow-all

import * as fs from "jsr:@std/fs";
import * as cli from "jsr:@std/cli";
import * as http from "jsr:@std/http";

let buildLock = false;
const args = cli.parseArgs(Deno.args, { "boolean": ["watch", "serve", "deploy"] });

async function handleFiles() {
	buildLock = true;
	const spinner = new cli.Spinner();
	spinner.message = "Building...";
	spinner.start();

	fs.emptyDir("target");

	const tsc = new Deno.Command("tsc", {args: ["--outDir", "target/js", "--pretty", "true"], stdout: "inherit", stderr: "inherit"});
	const tscResult = await tsc.output();
	if (!tscResult.success) {
		spinner.stop();
		buildLock = false;
		console.error("TypeScript error! See above.");
		return false;
	}

	await fs.copy("data", "target/data");
	await fs.copy("src/index.html", "target/index.html");
	await fs.copy("src/main.css", "target/main.css");
	await fs.copy("static", "target/static");

	await Deno.mkdir("target/src");
	await fs.copy("src/ts", "target/src/ts");

	spinner.stop();
	console.log("Built successfully");
	buildLock = false;

	return true;
}

async function watch() {
	const watcher = Deno.watchFs(["src", "data", "static"]);


	for await (const event of watcher) {
		if (event.kind === "access") {
			continue;
		}
		if (!buildLock) {
			handleFiles();
		}
	}

}

const result = await handleFiles();

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
