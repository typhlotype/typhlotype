import { Model } from "../model/model.js";
import * as i18nMap from "../model/i18nMap.js";
import * as dataFetch from "../controller/dataFetch.js";
import * as settingsController from "../controller/settingsController.js";
import * as livePrompt from "../ui/livePrompt.js";
import * as wordDisplay from "../ui/wordDisplay.js";
import { RawLetterInputEvent } from "../events/input/rawLetterInputEvent.js";
import { cancelDelayedPrompt } from "../model/delayedPrompt.js";
import { RandomWordGenerator } from "../model/randomWordGenerator.js";
import { settings } from "../model/settingsModel.js";
import { applyI18nLabels } from "../ui/applyI18nLabels.js";

/**
 * The Controller class is responsible for handling platform-dependant data
 * sources, such as handling user input, storing settings, and fetching resource
 * files.
 */
export class Controller {
	model: Model;

	private constructor(model: Model) {
		this.model = model;
	}

	static async new(): Promise<Controller> {
		// Load settings
		settingsController.init();

		// Load words and i18n data
		const [words, translation] = await Promise.all([
			dataFetch.get(`words/${settings.language.wordSetLanguage}/${settings.language.wordSet}.json`),
			dataFetch.get(`translations/${settings.language.interfaceLanguage}.json`),
		]);
		i18nMap.setMap(translation);

		const wordGenerator = new RandomWordGenerator(words);
		const model = new Model(wordGenerator);

		settingsController.updatePageFromSettings();

		livePrompt.init();
		wordDisplay.init();

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
		applyI18nLabels();

		document.querySelector("#beginBtn")?.addEventListener("click", () => {
			this.model.restart();
			document.querySelector("#practice")?.removeAttribute("hidden");
			(document.querySelector("#wordInput") as HTMLElement)?.focus();
		});

		document.querySelector("#settingsBtn")?.addEventListener("click", function() {
			document.querySelector("#settings")?.removeAttribute("hidden");
			(document.querySelector("#settings > h2") as HTMLElement)?.focus();
		});

		document.querySelector("#wordDisplay")?.addEventListener("click", () => {
			(document.querySelector("#wordInput") as HTMLElement)?.focus();
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

		document.querySelector("#wrapper")?.removeAttribute("hidden");
	}

}

