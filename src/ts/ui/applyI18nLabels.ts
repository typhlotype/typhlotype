import { i18n } from "../model/i18nMap.js";

export function applyI18nLabels(containerElement?: HTMLElement | Document) {
	if (containerElement === undefined) {
		containerElement = document;
	}

	for (const element of containerElement.querySelectorAll("[data-i18n]") as unknown as [Element]) {
		const attribute = element.getAttribute("data-i18n");

		if (attribute === null) {
			continue;
		}

		for (const key of attribute.split(';')) {
			let attrKeyPair = key.match(/\[([^\]]+)\]=(.+)/);

			if (attrKeyPair === null) {
				element.innerHTML = i18n(key);
			} else {
				const attrName = attrKeyPair[1];
				const key = attrKeyPair[2];
				element.setAttribute(attrName, i18n(key));
			}
		}
	}
}
