import type { ProtocolWithReturn } from 'webext-bridge';
import { MessageRegistry } from './messages-registry';
import { ServerHealth } from '~/Interface';

export interface BackgroundProtocolMap {
	[MessageRegistry.Background.GET_SERVER_URL]: ProtocolWithReturn<
		undefined,
		{ serverUrl?: string }
	>;
	[MessageRegistry.Background.SET_SERVER_URL]: ProtocolWithReturn<
		{ serverUrl?: string },
		{ serverHealth: ServerHealth }
	>;
	[MessageRegistry.Background.CHECK_SERVER_HEALTH]: ProtocolWithReturn<
		{ serverUrl?: string },
		{ serverHealth: ServerHealth }
	>;
}

export interface ContentScriptProtocolMap {
	[MessageRegistry.ContentScript.OPEN_SIDEBAR]: undefined;
	[MessageRegistry.ContentScript.CLOSE_SIDEBAR]: undefined;
	[MessageRegistry.ContentScript.TOGGLE_SIDEBAR]: undefined;
}
