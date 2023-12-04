import { onMessage } from 'webext-bridge/background';
import { BridgeMessage, ProtocolMap } from 'webext-bridge';
import { MessageHandlerType } from '~/Interface';

type onMessageParameters = Parameters<typeof onMessage>;

class MessageHandler {
	static registerOneMessageListener(
		listenerKey: onMessageParameters[0],
		messageHandler: MessageHandlerType,
	) {
		onMessage(listenerKey, async (message: BridgeMessage<any>) => {
			console.debug(`Received message ${listenerKey}:`);
			console.debug(message);
			const resp = await messageHandler(message.data, message.sender, message.timestamp);
			console.debug(`Message ${listenerKey} finished with response: `);
			console.debug(resp);
			return resp;
		});
		console.debug(`Registered listener ${listenerKey}`);
	}

	static on<K extends keyof ProtocolMap>(
		messageKey: onMessageParameters[0],
		messageHandler: MessageHandlerType,
	) {
		MessageHandler.registerOneMessageListener(messageKey, messageHandler);
	}
}

export default MessageHandler;
