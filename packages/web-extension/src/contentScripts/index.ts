/* eslint-disable no-console */
import { createApp } from 'vue';
import App from './views/App.vue';
import { setupApp } from '~/logic/common-setup';
import 'n8n-design-system/css/index.scss';
import { createPinia } from 'pinia';
import { FontAwesomePlugin } from '~/plugins/icons';

import fontAwesomeCSS from '@fortawesome/fontawesome-svg-core/styles.css?inline';

import { N8nPlugin } from 'n8n-design-system/plugin';

function addStylesheetFromUrl(shadowDOM: ShadowRoot, path: string) {
	const styleEl = document.createElement('link');
	styleEl.setAttribute('rel', 'stylesheet');
	styleEl.setAttribute('href', browser.runtime.getURL(path));
	shadowDOM.appendChild(styleEl);
}

function addStylesheetFromContent(shadowDOM: ShadowRoot, content: string) {
	const styleEl = document.createElement('style');
	styleEl.appendChild(document.createTextNode(content));
	shadowDOM.appendChild(styleEl);
}

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
	console.info('[vitesse-webext] Hello world from content script');

	// mount component to context window
	const container = document.createElement('div');
	container.id = __NAME__;
	const root = document.createElement('div');
	const styleEl = document.createElement('link');
	const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container;
	addStylesheetFromUrl(shadowDOM, 'dist/contentScripts/style.css');
	addStylesheetFromContent(shadowDOM, fontAwesomeCSS);

	shadowDOM.appendChild(styleEl);
	shadowDOM.appendChild(root);
	document.body.appendChild(container);
	const pinia = createPinia();
	const app = createApp(App);
	setupApp(app);
	app.use(pinia);
	app.use(N8nPlugin);
	app.use(FontAwesomePlugin);
	app.mount(root);
	console.log('App mounted !');
})();
