import { AssertivePromptEvent } from "../events/textPrompt/assertivePromptEvent.js";
import { PolitePromptEvent } from "../events/textPrompt/politePromptEvent.js";

export function init() {
	AssertivePromptEvent.subscribe(assertivePrompt);
	PolitePromptEvent.subscribe(politePrompt);
}

export function assertivePrompt(event: AssertivePromptEvent) {
	const { text, id } = event;

	const prompt = document.createElement("p");
	if (id) {
		prompt.setAttribute("id", id);
	}
	prompt.appendChild(document.createTextNode(text));

	let promptContainer = document.querySelector("#livePromptAssertive");
	if (!promptContainer) throw new Error("#livePromptAssertive did not exist");

	if (id) {
		document.getElementById(id)?.remove();
	}

	promptContainer.appendChild(prompt);
}

function politePrompt(event: PolitePromptEvent) {
	const { text, id } = event;

	const prompt = document.createElement("p");
	if (id) {
		prompt.setAttribute("id", id);
	}
	prompt.appendChild(document.createTextNode(text));

	let promptContainer = document.querySelector("#livePromptPolite");
	if (!promptContainer) throw new Error("#livePromptPolite did not exist");

	if (id) {
		document.getElementById(id)?.remove();
	}

	promptContainer.appendChild(prompt);
}
