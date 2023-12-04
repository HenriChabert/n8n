import { Endpoint } from 'webext-bridge';

export type MessageHandlerType = (data: any, sender: Endpoint, timestamp: number) => any;
