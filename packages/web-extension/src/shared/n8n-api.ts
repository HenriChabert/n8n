import { ApiResponse, ApiRequestOptions, ServerHealth } from '~/Interface';

class N8NApiHandler {
	private baseURL?: string = undefined;

	private cleanBaseUrl(url: string) {
		return url.replace(/\/+$/, '');
	}

	private restEndpoint(endpoint: string) {
		return `rest/${endpoint}`;
	}

	public async setBaseURL(serverUrl: string) {
		const baseURL = this.cleanBaseUrl(serverUrl);
		this.baseURL = baseURL;
	}

	constructor(n8nServerUrl?: string) {
		if (n8nServerUrl !== undefined) {
			this.setBaseURL(n8nServerUrl);
		}
	}

	private baseURlMissingError(): ApiResponse {
		return {
			success: false,
			error: 'Server URL not defined',
		};
	}

	private async request<T>(
		method: string,
		endpoint: string,
		data?: any,
		options?: ApiRequestOptions,
	): Promise<ApiResponse<T>> {
		let baseUrl;
		if (options?.serverUrl) {
			baseUrl = this.cleanBaseUrl(options.serverUrl);
		} else {
			baseUrl = this.baseURL;
		}
		if (!baseUrl) {
			return this.baseURlMissingError();
		}
		const url = `${baseUrl}/${endpoint}`;
		const headers = {
			'Content-Type': 'application/json',
		};

		const body = data ? JSON.stringify(data) : undefined;

		let returnResponse: ApiResponse;

		try {
			console.debug('Running following request: ');
			console.debug({ url, method, headers, body });
			const response = await fetch(url, {
				method,
				headers,
				body,
			});
			console.debug('Request succeeded with response: ');
			console.debug({ response });

			const responseData = await this.handleSuccessResponse(response);
			returnResponse = { success: true, data: responseData } as ApiResponse;
		} catch (error: any) {
			console.debug('Request failed with error: ');
			console.debug({ error });

			returnResponse = this.handleErrorResponse(error);
		}

		return returnResponse;
	}

	public get<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>('GET', url, undefined, options);
	}

	public post<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>('POST', url, data, options);
	}

	private handleSuccessResponse(response: Response): Promise<any> {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json();
	}

	private handleErrorResponse<T>(error: any): ApiResponse<T> {
		return { success: false, error: error.message };
	}

	public async healthCheck(serverUrl?: string): Promise<ServerHealth> {
		if (!serverUrl) {
			return ServerHealth.NO_URL;
		}
		const url = 'healthz';
		const serverHealthResponse = (await this.get(url, { serverUrl })) as ApiResponse<{
			status: 'ok' | 'nok';
		}>;

		if (serverHealthResponse?.success && serverHealthResponse.data?.status === 'ok') {
			return ServerHealth.UP;
		} else {
			return ServerHealth.DOWN;
		}
	}

	public async login(): Promise<ApiResponse<{ cookie: string }>> {
		const url = this.restEndpoint('login');
		return await this.get(url);
	}

	public async listWorkflows(): Promise<ApiResponse<{ workflows: [any] }>> {
		const url = this.restEndpoint('workflows');
		return await this.get(url);
	}
}

const n8nApi = new N8NApiHandler();
export default n8nApi;
