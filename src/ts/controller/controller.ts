import { RawLetterInputEvent } from "../events/input/rawLetterInputEvent.js";
import { model } from "../main.js";
import { cancelDelayedPrompt } from "../model/delayedPrompt.js";

export function init() {
	document.querySelector("#beginBtn")?.addEventListener("click", function() {
		model.restart();
		document.querySelector("#practice")?.removeAttribute("hidden");
		(document.querySelector("#wordInput") as HTMLElement)?.focus();
	});

	document.querySelector("#settingsBtn")?.addEventListener("click", function() {
		document.querySelector("#settings")?.removeAttribute("hidden");
		(document.querySelector("#settings > h2") as HTMLElement)?.focus();

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
}
