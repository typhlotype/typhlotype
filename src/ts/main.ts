import { Model } from "./model/model.js";
import * as i18nMap from "./model/i18nMap.js";
import * as dataFetch from "./dataFetch.js";
import * as livePrompt from "./ui/livePrompt.js";
import * as controller from "./controller/controller.js";
import { settings } from "./model/settingsModel.js";
import { RandomWordGenerator } from "./model/randomWordGenerator.js";

export let model: Model;

async function preDomInit() {
	const wordGen = new RandomWordGenerator(await dataFetch.get("words/en/200.json"));
	model = new Model(wordGen);
	i18nMap.setMap(await dataFetch.get("translations/en.json"));
	livePrompt.init();
}

document.addEventListener("DOMContentLoaded", async function() {
	preDomInit();
	controller.init();

	console.log("Running with settings:", settings);
});
