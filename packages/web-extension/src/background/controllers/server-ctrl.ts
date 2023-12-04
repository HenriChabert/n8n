import n8nApi from '~/shared/n8n-api';
import { ServerHealth } from '~/Interface';

export async function checkServerHealth(serverUrl?: string) {
	if (!serverUrl) {
		return {
			success: false,
			error: 'No Server URL provided',
		};
	}
	const serverHealth = await n8nApi.healthCheck(serverUrl);

	if (serverHealth !== ServerHealth.UP) {
		return {
			success: false,
			error: 'Provided server seems down',
		};
	}

	return {
		success: true,
		error: undefined,
	};
}
