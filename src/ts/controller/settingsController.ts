/**
 * This module is responsible for handling the settings page and persistent
 * settings storage. It reads the settings from the page and updates the
 * settings model accordingly. It also saves the settings to local storage and
 * reads them from there on startup, and handles detection of the user's
 * language if no settings exist.
 */

import { Settings, applySettings, settings } from "../model/settingsModel.js";
import { SettingsChangeEvent } from "../events/settingsChangeEvent.js";
import * as persistence from "./persistence.js";

/**
 * The language that should be chosen if the user does not prefer a language
 * that is among those available or if language detection is not available.
 */
const LANGUAGE_FALLBACK = "en";

let WORDS_INDEX: any;
let TRANSLATION_INDEX: any;

export async function init() {
	SettingsChangeEvent.subscribe(saveNewSettings);

	try {
		const savedSettingsString = persistence.getItem("settings");

		if (!savedSettingsString) {
			// There were no saved settings. Default settings are already
			// applied. Language detection is handled in `detectLanguage()`,
			// which is called elsewhere after the language index is loaded
			// dynamically.

			return;
		}

		const savedSettings = JSON.parse(savedSettingsString);

		applySettings(savedSettings, false);
	} catch (e) {
		console.error(e);
	}
}



export async function initDom(reinit: boolean) {
	if (!reinit) {
		for (const element of document.querySelectorAll("[data-action-fieldset=\"apply\"]") as unknown as [Element]) {
			element.addEventListener("click", () => {
				updateSettingsFromPage();
			});
		}
	}
}

export function updateIndicies(wordsIndex: any, translationIndex: any) {
	WORDS_INDEX = wordsIndex;
	TRANSLATION_INDEX = translationIndex;
}

export function languageDetection() {
	if (!settings.language.interfaceLanguage) {
		settings.language.interfaceLanguage = choosePreferredLanguage(TRANSLATION_INDEX.map((e: any) => { return e.id; })) || LANGUAGE_FALLBACK;
	}
	if (!settings.language.wordSetLanguage) {
		settings.language.wordSetLanguage = choosePreferredLanguage(
			WORDS_INDEX
			.filter((e: any) => { return e.defaultForLanguage && e.languageName })
			.map((e: any) => { return e.language; })
		) || LANGUAGE_FALLBACK;
		settings.language.wordSetVariant = WORDS_INDEX
			.filter((e: any) => { return e.language == settings.language.wordSetLanguage && e.defaultForLanguage })
			.map((e: any) => { return e.id; })[0]
			.split("/")[1];
	}
}

/**
 * Detects the user's preferred language from among the given options. Returns
 * null if the user does not prefer a language that is among the given options
 * or if language detection is not available.
 */
function choosePreferredLanguage(languageOptions: string[]) {
	for (const language of navigator.languages) {
		let languageCodeParts = language.split('-');

		if (languageOptions.includes(language)) {
			return language;
		} else {
			languageCodeParts.pop();

			if (languageCodeParts.length == 0) {
				continue;
			}
		}
	}

	console.warn("No preferred language found. Falling back to hardcoded default.");
	return null;
}

function saveNewSettings() {
	persistence.setItem("settings", JSON.stringify(settings));
}

/**
 * Reads the settings that have been selected in the GUI and applies them.
 */
function updateSettingsFromPage() {
	const newSettings: Partial<Settings> = {};

	for (const element of document.querySelectorAll("[data-settings-key]") as unknown as [Element]) {
		updateSettingsFromElement(element, newSettings);
	}

	applySettings(newSettings);
}

/**
 * Reads the setting that has been selected in a single element in the GUI and
 * applies it.
 */
function updateSettingsFromElement(element: Element, newSettings: Partial<Settings>) {
	const keyPath = element.getAttribute("data-settings-key");

	if (!keyPath) {
		return;
	}

	let parent: any = newSettings;

	// Resolve the key
	let keyElements = keyPath.split('.');

	for (const keyElement of keyElements.slice(0, keyElements.length - 1)) {
		if (!parent[keyElement]) {
			parent[keyElement] = {};
		}

		parent = parent[keyElement];
	}

	const key = keyElements[keyElements.length - 1];
	if (element instanceof HTMLInputElement && element.type === "checkbox") {
		parent[key] = element.checked;
	} else if (element instanceof HTMLSelectElement) {
		parent[key] = element.value;
	}
}

export function updatePageFromSettings() {
	updateDynamicResourceOptions("language.wordSetVariant", WORDS_INDEX, 1, (dynamicResource) => { return dynamicResource.language === settings.language.wordSetLanguage; });
	updateDynamicResourceOptions("language.wordSetLanguage", WORDS_INDEX, 0, (e) => { return e.defaultForLanguage && e.languageName; }, (e) => { return {name: e.languageName, id: e.id}; } );
	updateDynamicResourceOptions("language.interfaceLanguage", TRANSLATION_INDEX);

	updatePageValues()
}

function updatePageValues() {
	for (const element of document.querySelectorAll("[data-settings-key]") as unknown as [Element]) {
		const keyPath = element.getAttribute("data-settings-key");
		if (!keyPath) {
			continue;
		}

		// Resolve the key
		let keyElements = keyPath.split('.');
		let setting: any = settings;

		for (const keyElement of keyElements) {
			setting = setting[keyElement];
		}

		if (element instanceof HTMLInputElement && element.type === "checkbox") {
			element.checked = setting;
		} else if (element instanceof HTMLSelectElement) {
			element.value = setting;
		}
	}
}

function updateDynamicResourceOptions(settingsKey: string, index: any, subResourceNumber = 0, subResourceFilter?: (dynamicResource: any) => boolean, subResourceMap: (dynamicResource: any) => {id: string, name: string} = (e) => e) {
	let selectElement = document.querySelector("[data-settings-key=\"" + settingsKey + "\"]") as HTMLSelectElement;

	selectElement.clear();

	for (const dynamicResource of index) {
		if (subResourceFilter && !subResourceFilter(dynamicResource)) {
			continue;
		}

		const mappedDynamicResource = subResourceMap(dynamicResource);
		selectElement.add(new Option(mappedDynamicResource.name, mappedDynamicResource.id.split("/")[subResourceNumber]));
	}
}

declare global {
	interface HTMLSelectElement {
		clear(): void;
	}
}

HTMLSelectElement.prototype.clear = function() {
	while (this.options.length > 0) {
		this.remove(0);
	}
};
