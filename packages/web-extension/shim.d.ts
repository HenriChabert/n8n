import {
	ContentScriptProtocolMap,
	BackgroundProtocolMap,
} from '~/shared/intercom/messages-protocol-map';

interface ProtocolMap extends ContentScriptProtocolMap, BackgroundProtocolMap {}

declare module 'webext-bridge' {
	export interface ProtocolMap extends ContentScriptProtocolMap, BackgroundProtocolMap {}
}
