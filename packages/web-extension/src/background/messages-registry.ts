import MessageHandler from './message-handler';
import STORAGE_KEYS from './storage-keys';
import N8NApiHandler from '../shared/n8n-api';

const BROWSER_STORAGE = browser.storage.local;
const n8nApi = new N8NApiHandler('https://n8n.app-moba.com/');

export function registerListeners() {
	MessageHandler.on('SET_SERVER_URL', async ({ serverUrl }: { serverUrl?: string }) => {
		await BROWSER_STORAGE.set({ [STORAGE_KEYS.SERVER_URL]: serverUrl });
		return true;
	});

	MessageHandler.on('GET_SERVER_URL', async () => {
		const serverUrl = await BROWSER_STORAGE.get(STORAGE_KEYS.SERVER_URL);
		return serverUrl;
	});

	MessageHandler.on('CHECK_SERVER_HEALTH', async () => {});
}
