import { Model } from "../model/model.js";
import * as i18nMap from "../model/i18nMap.js";
import * as dataFetch from "../controller/dataFetch.js";
import * as settingsController from "../controller/settingsController.js";
import * as livePrompt from "../ui/livePrompt.js";
import * as wordDisplay from "../ui/wordDisplay.js";
import { RawLetterInputEvent } from "../events/input/rawLetterInputEvent.js";
import { cancelDelayedPrompt } from "../model/delayedPrompt.js";
import { RandomWordGenerator } from "../model/wordGenerators/randomWordGenerator.js";
import { settings } from "../model/settingsModel.js";
import { applyI18nLabels } from "../ui/applyI18nLabels.js";
import { SettingsChangeEvent } from "../events/SettingsChangeEvent.js";
import {  showSection } from "../ui/ui.js";

/**
 * The Controller class is responsible for handling platform-dependant data
 * sources, such as handling user input, storing settings, and fetching resource
 * files.
 */
export class Controller {
	model: Model | null = null;

	/**
	 * Private constructor to enforce the use of the static 'new' method.
	 */
	private constructor() {}

	/**
	 * Initializes or re-initializes the application by loading settings, words,
	 * and translations.
	 */
	async init(reinit=false) {
		// Load settings
		if (!reinit) {
			settingsController.init();
		}

		// Load words and i18n data
		const [words, translation] = await Promise.all([
			dataFetch.get(`words/${settings.language.wordSetLanguage}/${settings.language.wordSet}.json`),
			dataFetch.get(`translations/${settings.language.interfaceLanguage}.json`),
		]);
		i18nMap.setMap(translation, settings.language.interfaceLanguage || "en");

		this.model?.drop();

		const wordGenerator = new RandomWordGenerator(words);
		const model = new Model(wordGenerator);
		this.model = model;


		if (!reinit) {
			livePrompt.init();
			wordDisplay.init();
		}

		const controller = this;

		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", async function() {
				controller.initDom(reinit);
			});
		} else {
			controller.initDom(reinit);
		}
	}

	static async new(): Promise<Controller> {
		let controller = new Controller();
		await controller.init();
		SettingsChangeEvent.subscribe((e) => {controller.init(true)});
		return controller;
	}

	private initDom(reinit: boolean) {
		settingsController.updatePageFromSettings();
		applyI18nLabels();

		if (!reinit) {
			document.querySelector("#beginBtn")?.addEventListener("click", () => {
				this.model?.restart();
				showSection("#practice");
				(document.querySelector("#wordInput") as HTMLElement)?.focus();
			});

			document.querySelector("#settingsBtn")?.addEventListener("click", function() {
				showSection("#settings");
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
					for (const letter of e.data) {
						new RawLetterInputEvent(letter).send();
					}
				}
			});

			document.querySelector("#wordInput")?.addEventListener("blur", function() {
				cancelDelayedPrompt("wordPromptHint");
			});
		}

		document.querySelector("#loader")?.setAttribute("hidden", "");
		document.querySelector("#wrapper")?.removeAttribute("hidden");
	}

	drop() {
		this.model?.drop();
	}
}

