import { LetterPromptEvent } from "../events/activityPrompt/letterPromptEvent.js";

export function init() {
	LetterPromptEvent.subscribe(updateWordDisplay);
}

function updateWordDisplay(event: LetterPromptEvent) {
	const element = document.querySelector("#wordDisplay") as HTMLElement;

	if (element === null) {
		console.error("#wordDisplay is null!");
		return;
	}

	const typed = event.word.substring(0, event.wordPosition);
	const remaining = event.word.substring(event.wordPosition);

	const typedElement = createSpanWithText(typed, "typed");
	const remainingElement = createSpanWithText(remaining, "remaining");

	element.innerHTML = "";
	element.appendChild(typedElement)
	element.appendChild(remainingElement)

	const leftPos = document.querySelector("#wrapper")?.children[0].getBoundingClientRect().x ?? 0;

	element.style.left = (leftPos - typedElement.offsetWidth) + "px";
}

function createSpanWithText(text: string, className: string): HTMLElement {
	const span = document.createElement("span");
	span.setAttribute("class", className);
	span.appendChild(document.createTextNode(text));
	return span;
}
