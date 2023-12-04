import { Endpoint } from 'webext-bridge';

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface ApiRequestOptions {
	serverUrl?: string;
}

export type MessageHandlerType = (data: any, sender: Endpoint, timestamp: number) => any;

export enum ServerHealth {
	NO_URL,
	DOWN,
	UP,
}
