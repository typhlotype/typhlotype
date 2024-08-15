import { Model } from "../model/model.js";
import * as i18nMap from "../model/i18nMap.js";
import * as dataFetch from "../controller/dataFetch.js";
import * as settingsController from "../controller/settingsController.js";
import * as livePrompt from "../ui/livePrompt.js";
import { RawLetterInputEvent } from "../events/input/rawLetterInputEvent.js";
import { cancelDelayedPrompt } from "../model/delayedPrompt.js";
import { RandomWordGenerator } from "../model/randomWordGenerator.js";

export class Controller {
	model: Model;

	private constructor(model: Model) {
		this.model = model;
	}

	static async new(): Promise<Controller> {
		// Fetch resources and load settings
		const [words, translation] = await Promise.all([
			dataFetch.get("words/en/200.json"),
			dataFetch.get("translations/en.json"),
			settingsController.init()
		]);
		const wordGen = new RandomWordGenerator(words);
		const model = new Model(wordGen);
		i18nMap.setMap(translation);
		settingsController.updatePageFromSettings();

		livePrompt.init();

		let controller = new Controller(model);

		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", async function() {
				controller.initDom();
			});
		} else {
			controller.initDom();
		}

		return controller;
	}

	initDom() {
		document.querySelector("#beginBtn")?.addEventListener("click", () => {
			this.model.restart();
			document.querySelector("#practice")?.removeAttribute("hidden");
			(document.querySelector("#wordInput") as HTMLElement)?.focus();
		});

		document.querySelector("#settingsBtn")?.addEventListener("click", function() {
			document.querySelector("#settings")?.removeAttribute("hidden");
			(document.querySelector("#settings > h2") as HTMLElement)?.focus();
		});

		document.querySelector("#wordInput")?.addEventListener("input", function(_e) {
			let e = _e as InputEvent;
			cancelDelayedPrompt("wordPromptHint");

			if (e.data == null) {
				// do nothing
			} else {
				new RawLetterInputEvent(e.data[e.data.length-1]).send();
			}
		});

		document.querySelector("#wordInput")?.addEventListener("blur", function() {
			cancelDelayedPrompt("wordPromptHint");
		});
	}

}

