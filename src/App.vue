<template>
	<div id="loader">
		<progress></progress>
	</div>
	<div id="wrapper" hidden>
		<header>
			<h1 data-i18n="application.title"></h1>
			<nav>
				<ul>
					<li>
						<button id="beginBtn" accesskey="1">
							<div><svg width="24" height="24" viewBox="120 -840 720 720" aria-hidden="true"><use href="static/icons/play_arrow.svg#a"></use></svg></div>
							<span data-i18n="application.begin"></span>
						</button>
					</li>
					<li>
						<button id="introductionBtn" accesskey="2" disabled>
							<div><svg width="24" height="24" viewBox="0 -960 960 960" aria-hidden="true"><use href="static/icons/chart.svg#a"></use></svg></div>
							<span data-i18n="application.progress"></span>
						</button>
					</li>
					<li>
						<button id="settingsBtn" accesskey="3">
							<div><svg width="24" height="24" viewBox="0 -960 960 960" aria-hidden="true"><use href="static/icons/settings.svg#a"></use></svg></div>
							<span data-i18n="application.openSettings"></span>
						</button>
					</li>
					<li>
						<a href="https://lauritzt.dk/en/contact/" accesskey="4">
							<div><svg width="24" height="24" viewBox="0 -960 960 960" aria-hidden="true"><use href="static/icons/feedback.svg#a"></use></svg></div>
							<span data-i18n="application.giveFeedbackShort;[aria-label]=application.giveFeedback"></span>
						</a>
					</li>
				</ul>
			</nav>
		</header>

		<div id="livePromptAssertive" aria-live="assertive" class="visuallyHidden"></div>
		<div id="livePromptPolite" aria-live="polite" class="visuallyHidden"></div>

		<section id="practice" hidden data-section-type="main">
			<p id="wordDisplay"></p>

			<input id="wordInput" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" list="_autocompleteOff" spellcheck="false" aria-label="" class="visuallyHidden">
		</section>

		<section id="settings" hidden data-section-type="main">
			<h2 tabindex="-1" data-i18n="settings.heading"></h2>
			<SettingsPanel />
		</section>

		<section id="info" data-section-type="main">
			<p data-i18n="application.info"></p>
		</section>
	</div>
</template>

<script lang="ts">
import SettingsPanel from "./ts/ui/SettingsPanel.vue";

export default {
	components: {
		SettingsPanel,
	},
}
</script>
