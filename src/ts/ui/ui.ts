export function showSection(selectors: string) {
	const element = document.querySelector(selectors);
	if (!element) {
		throw new Error(`Element with selector \"${selectors}\" not found`);
	}

	// Hide all other elements
	const sectionType = element.getAttribute("data-section-type");
	if (sectionType) {
		for (const otherElement of document.querySelectorAll("[data-section-type=\"" + sectionType.replace("\"", "\\\"") + "\"]") as unknown as [Element]) {
			otherElement.setAttribute("hidden", "true");
		}
	}

	element.removeAttribute("hidden");
}
