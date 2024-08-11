import { DelayedHintFireEvent } from "../events/activityPrompt/delayedHintFireEvent.js";
import { PolitePromptEvent } from "../events/textPrompt/politePromptEvent.js";

const delayedPromptHandles: Record<string, any> = {};


export function delayedPrompt(text: string, id?: string) {
	let handle = setTimeout(delayedPromptHandler, 2000, text, id);
	if (id) {
		if (delayedPromptHandles[id] !== undefined) {
			clearTimeout(delayedPromptHandles[id]);
		}
		delayedPromptHandles[id] = handle;
	}
}

export function cancelDelayedPrompt(id: string) {
	if (delayedPromptHandles[id] !== undefined) {
		clearTimeout(delayedPromptHandles[id]);
		delayedPromptHandles[id] = undefined;
	}
	document.getElementById(id)?.remove();
}

function delayedPromptHandler(text: string, id?: string) {
	// Cancel the prompt if the user has unfocused the word input field
	// TODO This needs to go to controller, which can call cancelDelayedPrompt
	// on blurs
	if (!document.querySelector("#wordInput")?.contains(document.activeElement)) {
		return;
	}

	new DelayedHintFireEvent(text, "_").send();
	new PolitePromptEvent(text, id).send();
}

