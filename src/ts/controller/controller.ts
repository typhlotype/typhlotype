import { Model } from "../model/model";
import * as i18nMap from "../model/i18nMap";
import * as dataFetch from "../controller/dataFetch";
import * as settingsController from "../controller/settingsController";
import * as livePrompt from "../ui/livePrompt";
import * as wordDisplay from "../ui/wordDisplay";
import { RawLetterInputEvent } from "../events/input/rawLetterInputEvent";
import { cancelDelayedPrompt } from "../model/delayedPrompt";
import { RandomWordGenerator } from "../model/wordGenerators/randomWordGenerator";
import { StandardKeyboardLayout } from "../model/keyboardLayouts/standardKeyboardLayout";
import { settings } from "../model/settingsModel";
import { applyI18nLabels } from "../ui/applyI18nLabels";
import { SettingsChangeEvent } from "../events/SettingsChangeEvent";
import { showSection } from "../ui/ui";

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
		const [words, translation, keyboardLayoutSpec] = await Promise.all([
			dataFetch.get(`words/${settings.language.wordSetLanguage}/${settings.language.wordSet}.json`),
			dataFetch.get(`translations/${settings.language.interfaceLanguage}.json`),
			dataFetch.get(`keyboardLayouts/${settings.input.layoutRegion}/${settings.input.layoutVariant}.json`),
		]);
		i18nMap.setMap(translation, settings.language.interfaceLanguage || "en");

		this.model?.drop();

		const wordGenerator = new RandomWordGenerator(words);
		const keyboardLayout = new StandardKeyboardLayout(keyboardLayoutSpec)
		this.model = new Model(wordGenerator, keyboardLayout);


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
		const controller = new Controller();
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
				const e = _e as InputEvent;
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

