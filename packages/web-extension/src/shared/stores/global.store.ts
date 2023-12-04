import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('globals', {
	state: () => ({
		version: '0.0.1',
	}),
});
