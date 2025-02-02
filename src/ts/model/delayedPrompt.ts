import { settings } from "./settingsModel.js";
import { DelayedHintFireEvent } from "../events/activityPrompt/delayedHintFireEvent.js";
import { PolitePromptCancellationEvent } from "../events/textPrompt/politePromptCancellationEvent.js";
import { PolitePromptEvent } from "../events/textPrompt/politePromptEvent.js";

const delayedPromptHandles: Record<string, any> = {};

export function delayedPrompt(text: string, letter: string, id?: string) {
	let handle = setTimeout(delayedPromptHandler, settings.keyPrompt.hintDelayTimeMs, text, letter, id);
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
	new PolitePromptCancellationEvent(id).send();
}

function delayedPromptHandler(text: string, letter: string, id?: string) {
	new DelayedHintFireEvent(letter).send();
	new PolitePromptEvent(text, id).send();
}

