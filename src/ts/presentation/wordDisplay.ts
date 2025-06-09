import { LetterPromptEvent } from "../events/activityPrompt/letterPromptEvent.js";
import { EventSubscriptionToken } from "../events/eventSubscriptionToken.js";
import { ActiveSectionChangeEvent } from "../events/presentation/activeSectionChangeEvent.js";
import { Model } from "../model/model.js";
import { Module } from "../module.js";

/**
 * The WordDisplay module handles visually displaying the current word to type,
 * and highlighting the part that has already been typed.
 */
export class WordDisplay implements Module {
	active = false;
	model: Model;
	eventTokens: EventSubscriptionToken[] = [];

	constructor(model: Model) {
		this.model = model;
	}

	initialize(model: Model, reinit: boolean): void {
		this.model = model;

		if (!reinit) {
			this.eventTokens.push(LetterPromptEvent.subscribe((e: LetterPromptEvent) => this.updateWordDisplay(e)));
			this.eventTokens.push(ActiveSectionChangeEvent.subscribe(
				(e: ActiveSectionChangeEvent) => this.setActive(e.newSectionSelector === "#practice")
			));
			addEventListener("resize", this.updateWordDisplayPosition);
		}
	}

	setActive(value: boolean) {
		this.active = value;
		this.updateWordDisplay({ word: this.model.word, wordPosition: this.model.position });
	}

	updateWordDisplay(event: { word: string, wordPosition: number }) {
		if (!this.active) {
			return;
		}

		const element = this.getWordDisplayElement();

		if (element === null) {
			console.error("#wordDisplay is null!");
			return;
		}

		const typed = event.word.substring(0, event.wordPosition);
		const remaining = event.word.substring(event.wordPosition);

		const typedElement = this.createSpanWithText(typed, "typed");
		const remainingElement = this.createSpanWithText(remaining, "remaining");

		element.innerHTML = "";
		element.appendChild(typedElement);
		element.appendChild(remainingElement);

		this.updateWordDisplayPosition();
	}

	getWordDisplayElement(): HTMLElement {
		return document.querySelector("#wordDisplay") as HTMLElement;
	}

	updateWordDisplayPosition() {
		if (!this.active) {
			return;
		}

		const wordDisplay = this.getWordDisplayElement();
		const typed = wordDisplay.querySelector(".typed") as HTMLElement;

		const leftPos = document.querySelector("#wrapper")?.children[0].getBoundingClientRect().x ?? 0;
		wordDisplay.style.left = (leftPos - typed.offsetWidth) + "px";
	}

	createSpanWithText(text: string, className: string): HTMLElement {
		const span = document.createElement("span");
		span.setAttribute("class", className);
		span.appendChild(document.createTextNode(text));
		return span;
	}

	drop(): void {
		this.eventTokens.forEach((e) => e.drop());
	}
}

