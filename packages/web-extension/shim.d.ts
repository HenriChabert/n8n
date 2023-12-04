import type { ProtocolWithReturn } from 'webext-bridge';

declare module 'webext-bridge' {
	export interface ProtocolMap {
		// define message protocol types
		// see https://github.com/antfu/webext-bridge#type-safe-protocols
		TAB_PREVIEW: { title: string | undefined };
		GET_CURRENT_TAB: ProtocolWithReturn<{ tabId: number }, { title?: string }>;
		OPEN_SIDEBAR: undefined;
		CLOSE_SIDEBAR: undefined;
		TOGGLE_SIDEBAR: undefined;
		GET_SERVER_URL: ProtocolWithReturn<undefined, { serverUrl?: string }>;
		SET_SERVER_URL: { serverUrl?: string };
		CHECK_SERVER_HEALTH: ProtocolWithReturn<{ serverUrl?: string }, { isServerUp?: boolean }>;
	}
}
