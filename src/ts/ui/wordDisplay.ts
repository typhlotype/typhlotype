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


	const typedElement = document.createElement("span");
	typedElement.setAttribute("class", "typed");
	typedElement.appendChild(document.createTextNode(typed));

	const remainingElement = document.createElement("span");
	remainingElement.setAttribute("class", "remaining");
	remainingElement.appendChild(document.createTextNode(remaining));

	element.innerHTML = "";
	element.appendChild(typedElement);
	element.appendChild(remainingElement);
}
