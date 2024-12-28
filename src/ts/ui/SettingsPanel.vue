<template>
	<fieldset>
		<legend><h3 data-i18n="settings.language.heading"></h3></legend>

		<div>
			<label for="interfaceLanguage" data-i18n="settings.language.interfaceLanguage"></label>
			<select id="interfaceLanguage" data-settings-key="language.interfaceLanguage">
				<option value="en" language="en">English</option>
				<option value="da" language="da">Dansk</option>
			</select>
		</div>


		<div>
			<label for="wordSetLanguage" data-i18n="settings.language.wordSetLanguage"></label>
			<select id="wordSetLanguage" data-settings-key="language.wordSetLanguage">
				<option value="en" lang="en">English</option>
				<option value="en-us" lang="en">English (United States)</option>
				<option value="da" lang="da">Dansk</option>
			</select>
		</div>

		<button @click="updateSettingsFromPage">Apply language settings</button>
	</fieldset>

	<fieldset>
		<legend><h3>Input settings</h3></legend>

		<div>
			<label for="keyboardLayoutRegion">Keyboard layout language</label>
			<select id="keyboardLayoutRegion" data-settings-key="input.layoutRegion">
				<option value="basic">Basic</option>
				<option value="en-gb">English (United Kingdom)</option>
				<option value="en-us">English (United States)</option>
				<option value="da">Danish</option>
			</select>
		</div>

		<div>
			<label for="keyboardLayout">Keyboard layout variant</label>
			<select id="keyboardLayout" data-settings-key="input.layoutVariant">
				<option value="qwerty">QWERTY</option>
				<option value="colemak" disabled>Colemak</option>
			</select>
		</div>

		<div>
			<label for="angleMod">Bottom row finger shift angle</label>
			<select id="angleMod" data-settings-key="input.angleMod">
				<option value="straight">Straight (ortholinear)</option>
				<option value="right" disabled>Right (traditional)</option>
				<option value="left" disabled>Left (ergonomic)</option>
			</select>
		</div>

		<button @click="updateSettingsFromPage">Apply input settings</button>
	</fieldset>

	<fieldset>
		<legend><h3 id="keyPrompt">Prompt message contents</h3></legend>

		<div class="inputLabelPair">
			<input type="checkbox" id="keyPrompt-actionDescription" name="keyPrompt-actionDescription" aria-describedby="keyPrompt" data-settings-key="keyPrompt.actionDescription">
			<label for="keyPrompt-actionDescription">Action description (e.g. press)</label>
		</div>

		<div class="inputLabelPair">
			<input type="checkbox" id="keyPrompt-letter" name="keyPrompt-letter" aria-describedby="keyPrompt" data-settings-key="keyPrompt.letter">
			<label for="keyPrompt-letter">Letter</label>
		</div>

		<div class="inputLabelPair">
			<input type="checkbox" id="keyPrompt-phoneticSpellingAlphabet" name="keyPrompt-phoneticSpellingAlphabet" aria-describedby="keyPrompt" data-settings-key="keyPrompt.phoneticSpellingAlphabet">
			<label for="keyPrompt-phoneticSpellingAlphabet">Letter in the phonetic spelling alphabet</label>
		</div>

		<div class="inputLabelPair">
			<input type="checkbox" id="keyPrompt-fingerLocation" name="keyPrompt-fingerLocation"  aria-describedby="keyPrompt" data-settings-key="keyPrompt.locationAssistance">
			<label for="keyPrompt-fingerLocation">Location assistance (which finger to press)</label>
		</div>

		<button @click="updateSettingsFromPage">Apply key prompt settings</button>
	</fieldset>

	<fieldset>
		<legend><h3>Prompt speech methods</h3></legend>

		<div class="inputLabelPair">
			<input type="checkbox" id="promptSpeechMethods-live" name="promptSpeechMethods-live" data-settings-key="promptSpeechMethods.live">
			<label for="promptSpeechMethods-live">Live (recommended for screen readers)</label>
		</div>

		<div class="inputLabelPair">
			<input type="checkbox" id="promptSpeechMethods-label" name="promptSpeechMethods-label" data-settings-key="promptSpeechMethods.label">
			<label for="promptSpeechMethods-label">Label on input field</label>
		</div>

		<div class="inputLabelPair">
			<input type="checkbox" id="promptSpeechMethods-speech" name="promptSpeechMethods-speech" data-settings-key="promptSpeechMethods.speech">
			<label for="promptSpeechMethods-speech">Independent speech synthesis</label>
		</div>

		<button @click="updateSettingsFromPage">Apply prompt speech methods settings</button>
	</fieldset>
</template>

<script lang="ts">
import { reactive } from "vue";
import { settings as settingsGlobal } from "../model/settingsModel";
import { updateSettingsFromPage } from "../controller/settingsController";

export default {
	data() {
		return {
			settings: reactive(settingsGlobal),
		};
	},
	methods: {
		updateSettingsFromPage,
	}
}
</script>
