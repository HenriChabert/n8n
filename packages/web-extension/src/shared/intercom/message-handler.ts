import { onMessage } from 'webext-bridge/background';
import { BridgeMessage } from 'webext-bridge';
import * as type_fest from 'type-fest';

class MessageHandler {
	static on<Data extends type_fest.JsonValue, K extends string = string>(
		messageID: Parameters<typeof onMessage<Data, K>>[0],
		messageHandler: Parameters<typeof onMessage<Data, K>>[1],
	) {
		onMessage(messageID, async (message: BridgeMessage<any>) => {
			console.debug(`Received message ${messageID}:`);
			console.debug(message);
			const resp = await messageHandler(message);
			console.debug(`Message ${messageID} finished with response: `);
			console.debug(resp);
			return resp;
		});
		console.debug(`Registered listener ${messageID}`);
	}
}

export default MessageHandler;
