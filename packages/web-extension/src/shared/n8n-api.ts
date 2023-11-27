interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

class N8NApiHandler {
    private baseURL?: string = undefined;
    
    private buildBaseURL(serverUrl: string) {
        return `${serverUrl}/rest/`;
    }
    
    public async setBaseURL(serverUrl: string) {
        const baseURL = this.buildBaseURL(serverUrl);
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
            error: "Server URL not defined",
        };
    }
    
    private async request<T>(
        method: string,
        url: string,
        data?: any
        ): Promise<ApiResponse<T>> {
            if (!this.baseURL) {
                return this.baseURlMissingError();
            }
            try {
                const response = await fetch(`${this.baseURL}${url}`, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        // Add any other headers you may need
                    },
                    body: data ? JSON.stringify(data) : undefined,
                });
                const responseData = await this.handleSuccessResponse(response);
                return { success: true, data: responseData };
            } catch (error: any) {
                return this.handleErrorResponse(error);
            }
        }
        
        public get<T>(url: string): Promise<ApiResponse<T>> {
            return this.request<T>("GET", url);
        }
        
        public post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
            return this.request<T>("POST", url, data);
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
        public async login() {
            const url = "login";
            return await this.get(url);
        }
        
        public async listWorkflows() {
            const url = "workflows";
            return await this.get(url);
        }
    }
    
    export default N8NApiHandler;
    