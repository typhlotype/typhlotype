import * as wordDisplay from "./wordDisplay.js";

export function showSection(selector: string) {
	const element = document.querySelector(selector);
	if (!element) {
		throw new Error(`Element with selector \"${selector}\" not found`);
	}

	// Hide all other elements
	const sectionType = element.getAttribute("data-section-type");
	if (sectionType) {
		for (const otherElement of document.querySelectorAll("[data-section-type=\"" + sectionType.replace("\\", "\\\\").replace("\"", "\\\"") + "\"]") as unknown as [Element]) {
			otherElement.setAttribute("hidden", "true");
		}
	}

	wordDisplay.setActive(selector === "#practice");

	element.removeAttribute("hidden");
}
