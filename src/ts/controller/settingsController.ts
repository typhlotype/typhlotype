import { Settings, applySettings, settings } from "../model/settingsModel.js";
import { SettingsChangeEvent } from "../events/SettingsChangeEvent.js";

export async function init() {
	SettingsChangeEvent.subscribe(saveNewSettings);
	SettingsChangeEvent.subscribe(updatePageFromSettings);

	// @ts-ignore
	for (const element of document.querySelectorAll("[data-action-fieldset=\"apply\"]")) {
		element.addEventListener("click", () => {
			updateSettingsFromPage();
		});
	}


	try {
		const savedSettingsString = localStorage.getItem("settings");
		if (!savedSettingsString) {
			return;
		}

		const savedSettings = JSON.parse(savedSettingsString);

		applySettings(savedSettings);
	} catch (e) {
		console.error(e);
	}
}


function saveNewSettings() {
	localStorage.setItem("settings", JSON.stringify(settings));
}

function updateSettingsFromPage() {
	const newSettings: Partial<Settings> = {};

	// @ts-ignore
	for (const element of document.querySelectorAll("[data-settings-key]")) {
		updateSettingsFromElement(element, newSettings);
	}

	applySettings(newSettings);
}

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
	// @ts-ignore
	for (const element of document.querySelectorAll("[data-settings-key]")) {
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
