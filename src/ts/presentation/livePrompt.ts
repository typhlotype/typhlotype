import { Dropper } from "../droppable.js";
import { EventSubscriptionToken } from "../events/eventSubscriptionToken.js";
import { AssertivePromptEvent } from "../events/textPrompt/assertivePromptEvent.js";
import { PolitePromptCancellationEvent } from "../events/textPrompt/politePromptCancellationEvent.js";
import { PolitePromptEvent } from "../events/textPrompt/politePromptEvent.js";
import { Model } from "../model/model.js";
import { Module } from "../module.js";

/**
 * LivePrompt is the module that provides prompts to assistive technology via
 * ARIA Live.
 */
export class LivePrompt implements Module {
	eventSubscriptions: EventSubscriptionToken[] = [];

	initialize(model: Model, reinit: boolean): void {
		this.eventSubscriptions.push(
			AssertivePromptEvent.subscribe(this.assertivePrompt)
		);
		this.eventSubscriptions.push(
			PolitePromptEvent.subscribe(this.politePrompt)
		);
		this.eventSubscriptions.push(
			PolitePromptCancellationEvent.subscribe(this.politePromptCancellation)
		);
	}

	assertivePrompt(event: AssertivePromptEvent) {
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

	politePrompt(event: PolitePromptEvent) {
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

	politePromptCancellation(event: PolitePromptCancellationEvent) {
		document.getElementById(event.id)?.remove();
	}


	drop(): void {
		this.eventSubscriptions.forEach((t) => t.drop())
	}
}
