import { LetterPromptEvent } from "../events/activityPrompt/letterPromptEvent.js";
import { Model } from "../model/model.js";

let active = false;
let model: Model;

export function init(globalModel: Model) {
	model = globalModel;
	LetterPromptEvent.subscribe(updateWordDisplay);
	addEventListener("resize", updateWordDisplayPosition);
}

export function updateModel(globalModel: Model) {
	model = globalModel;
}

export function setActive(value: boolean) {
	active = value;
	updateWordDisplay({ word: model.word, wordPosition: model.position });
}

function getWordDisplayElement(): HTMLElement {
	return document.querySelector("#wordDisplay") as HTMLElement;
}

function updateWordDisplay(event: { word: string, wordPosition: number }) {
	if (!active) {
		return;
	}

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
	if (!active) {
		return;
	}

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
