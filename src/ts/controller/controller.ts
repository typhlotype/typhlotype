import { Model } from "../model/model.js";
import * as i18nMap from "../model/i18nMap.js";
import * as dataFetch from "../controller/dataFetch.js";
import * as settingsController from "../controller/settingsController.js";
import * as livePrompt from "../presentation/livePrompt.js";
import * as wordDisplay from "../presentation/wordDisplay.js";
import { RawLetterInputEvent } from "../events/input/rawLetterInputEvent.js";
import { cancelDelayedPrompt } from "../model/delayedPrompt.js";
import { RandomWordGenerator } from "../model/wordGenerators/randomWordGenerator.js";
import { StandardKeyboardLayout } from "../model/keyboardLayouts/standardKeyboardLayout.js";
import { settings } from "../model/settingsModel.js";
import { applyI18nLabels } from "../presentation/applyI18nLabels.js";
import { SettingsChangeEvent } from "../events/settingsChangeEvent.js";
import { showSection } from "../presentation/presentation.js";
import { Module } from "../module.js";
import { TypingTimer } from "./typingTimer.js";

/**
 * The Controller class is responsible for handling platform-dependant data
 * sources, such as handling user input, storing settings, and fetching resource
 * files.
 */
export class Controller {
	model: Model | null = null;
	modules: Module[] = [];

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

		// Load indicies, which contain information about dynamic resources are
		// available.
		const [wordsIndex, translationIndex] = await Promise.all([
			dataFetch.get(`words/index.json`),
			dataFetch.get(`translations/index.json`),
		]);

		settingsController.updateIndicies(wordsIndex, translationIndex);
		settingsController.languageDetection();

		// Load words and i18n data
		const [words, translation, keyboardLayoutSpec] = await Promise.all([
			dataFetch.get(`words/${settings.language.wordSetLanguage}/${settings.language.wordSetVariant}.json`),
			dataFetch.get(`translations/${settings.language.interfaceLanguage}.json`),
			dataFetch.get(`keyboardLayouts/${settings.input.layoutRegion}/${settings.input.layoutVariant}.json`),
		]);
		i18nMap.setMap(translation, settings.language.interfaceLanguage || "en");

		this.model?.drop();

		const wordGenerator = new RandomWordGenerator(words);
		const keyboardLayout = new StandardKeyboardLayout(keyboardLayoutSpec)
		const model = new Model(wordGenerator, keyboardLayout);
		this.model = model;


		// Legacy "modules" are initialized manually
		if (!reinit) {
			livePrompt.init();
			wordDisplay.init(this.model);
		} else {
			wordDisplay.updateModel(this.model);
		}

		if (!reinit) {
			this.modules.push(new TypingTimer());
		}

		this.modules.forEach((e) => e.initialize(model, reinit));

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

				// Cancel the delayed hint for the previous letter, since the
				// user is now typing
				cancelDelayedPrompt("wordPromptHint");

				// Prevent the letter actually being entered into the input box,
				// since that may cause a screen reader to read out the word,
				// including potential incorrect characters.
				e.preventDefault();

				if (e.inputType == "insertText" && e.data != null) {
					for (const letter of e.data) {
						new RawLetterInputEvent(letter).send();
					}
				}
			});

			document.querySelector("#wordInput")?.addEventListener("blur", function() {
				cancelDelayedPrompt("wordPromptHint");
			});
		}

		settingsController.initDom(reinit);

		document.querySelector("#loader")?.setAttribute("hidden", "");
		document.querySelector("#wrapper")?.removeAttribute("hidden");
	}

	drop() {
		this.model?.drop();
	}
}

