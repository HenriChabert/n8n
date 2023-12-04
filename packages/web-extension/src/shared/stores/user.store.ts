import { defineStore } from 'pinia';
import { sendMessage } from 'webext-bridge/content-script';

export const useUsersStore = defineStore('users', {
	getters: {
		async serverUrl() {
			const serverUrl = await sendMessage('GET_SERVER_URL', undefined, 'background');
			return serverUrl.serverUrl;
		},
	},
	actions: {
		async setStoreUrl(serverUrl?: string) {
			await sendMessage(
				'SET_SERVER_URL',
				{
					serverUrl: serverUrl,
				},
				'background',
			);
		},
		async checkServerHealth(serverUrl: string) {
			const { isServerUp } = await sendMessage('CHECK_SERVER_HEALTH', { serverUrl }, 'background');
			return isServerUp;
		},
	},
});
