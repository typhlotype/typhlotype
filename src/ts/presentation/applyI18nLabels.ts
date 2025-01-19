import { i18n } from "../model/i18nMap.js";

/**
 * Applies internationalization labels to the specified HTML container element
 * or the entire document.
 *
 * This is done by replacing the contents of elements with an `data-i18n`
 * attribute, using that attribute as the i18n key.
 *
 * Additionally, if the attribute is in the form of `[attributeName]=key`, the
 * attribute will be set to the i18n value of the given key. Multiple attributes
 * can be specified, separated by `;`.
 *
 * @param containerElement The container element to apply the labels to. If not
 * provided, the entire document will be used.
 *
 * @see i18n
 */
export function applyI18nLabels(containerElement?: HTMLElement | Document | undefined) {
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
