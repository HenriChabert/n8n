import { defineStore } from 'pinia';
import { sendMessage } from 'webext-bridge/content-script';
import { MessageRegistry } from '~/shared/intercom/messages-registry';

export const useUsersStore = defineStore('users', {
	getters: {
		async serverUrl() {
			const serverUrl = await sendMessage(
				MessageRegistry.Background.GET_SERVER_URL,
				undefined,
				'background',
			);
			return serverUrl.serverUrl;
		},
	},
	actions: {
		async setStoreUrl(serverUrl?: string) {
			return await sendMessage(
				MessageRegistry.Background.SET_SERVER_URL,
				{
					serverUrl: serverUrl,
				},
				'background',
			);
		},
		async checkServerHealth(serverUrl?: string) {
			const { serverHealth } = await sendMessage(
				MessageRegistry.Background.CHECK_SERVER_HEALTH,
				{ serverUrl },
				'background',
			);
			return serverHealth;
		},
	},
});
