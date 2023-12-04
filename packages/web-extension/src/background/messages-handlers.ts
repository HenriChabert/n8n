import STORAGE_KEYS from './storage-keys';
import n8nApi from '~/shared/n8n-api';
import MessageHandler from '~/shared/intercom/message-handler';

import { MessageRegistry } from '~/shared/intercom/messages-registry';

const BROWSER_STORAGE = browser.storage.local;

export function registerListeners() {
	MessageHandler.on(MessageRegistry.Background.SET_SERVER_URL, async ({ data }) => {
		const { serverUrl } = data;

		const serverHealth = await n8nApi.healthCheck(serverUrl);

		await BROWSER_STORAGE.set({ [STORAGE_KEYS.SERVER_URL]: serverUrl });
		n8nApi.setBaseURL(serverUrl!);
		return { serverHealth };
	});

	MessageHandler.on(MessageRegistry.Background.GET_SERVER_URL, async () => {
		const serverUrl = await BROWSER_STORAGE.get(STORAGE_KEYS.SERVER_URL);
		return serverUrl;
	});

	MessageHandler.on(MessageRegistry.Background.CHECK_SERVER_HEALTH, async ({ data }) => {
		const { serverUrl } = data;

		const serverHealth = await n8nApi.healthCheck(serverUrl);

		return { serverHealth };
	});
}
