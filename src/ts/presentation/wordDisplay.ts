import { LetterPromptEvent } from "../events/activityPrompt/letterPromptEvent.js";

export function init() {
	LetterPromptEvent.subscribe(updateWordDisplay);
	addEventListener("resize", updateWordDisplayPosition);
}

function getWordDisplayElement(): HTMLElement {
	return document.querySelector("#wordDisplay") as HTMLElement;
}

function updateWordDisplay(event: LetterPromptEvent) {
	const element = getWordDisplayElement();

	if (element === null) {
		console.error("#wordDisplay is null!");
		return;
	}

	const typed = event.word.substring(0, event.wordPosition);
	const remaining = event.word.substring(event.wordPosition);

	const typedElement = createSpanWithText(typed, "typed");
	const remainingElement = createSpanWithText(remaining, "remaining");

	element.innerHTML = "";
	element.appendChild(typedElement);
	element.appendChild(remainingElement);

	updateWordDisplayPosition();
}

function updateWordDisplayPosition() {
	const wordDisplay = getWordDisplayElement();
	const typed = wordDisplay.querySelector(".typed") as HTMLElement;

	const leftPos = document.querySelector("#wrapper")?.children[0].getBoundingClientRect().x ?? 0;
	wordDisplay.style.left = (leftPos - typed.offsetWidth) + "px";
}

function createSpanWithText(text: string, className: string): HTMLElement {
	const span = document.createElement("span");
	span.setAttribute("class", className);
	span.appendChild(document.createTextNode(text));
	return span;
}
