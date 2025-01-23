import { DelayedHintFireEvent } from "../events/activityPrompt/delayedHintFireEvent.js";
import { PolitePromptCancellationEvent } from "../events/textPrompt/politePromptCancellationEvent.js";
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
	new PolitePromptCancellationEvent(id).send();
}

function delayedPromptHandler(text: string, id?: string) {
	new DelayedHintFireEvent(text, "_").send();
	new PolitePromptEvent(text, id).send();
}

