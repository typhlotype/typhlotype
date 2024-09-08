import { LetterPromptEvent } from "../events/activityPrompt/letterPromptEvent.js";

export function init() {
	LetterPromptEvent.subscribe(updateWordDisplay);
}

function updateWordDisplay(event: LetterPromptEvent) {
	const element = document.querySelector("#wordDisplay");

	if (element === null) {
		console.error("#wordDisplay is null!");
		return;
	}

	const typed = event.word.substring(0, event.wordPosition);
	const remaining = event.word.substring(event.wordPosition);

	const children = [
		createSpanWithText(typed, "typed"),
		createSpanWithText(remaining, "remaining"),
	];

	element.innerHTML = "";
	for (const child of children) {
		element.appendChild(child)
	}
}

function createSpanWithText(text: string, className: string) {
	const span = document.createElement("span");
	span.setAttribute("class", className);
	span.appendChild(document.createTextNode(text));
	return span;
}
