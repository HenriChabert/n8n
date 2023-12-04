export namespace MessageRegistry {
	export enum Background {
		GET_SERVER_URL = 'GET_SERVER_URL',
		SET_SERVER_URL = 'SET_SERVER_URL',
		CHECK_SERVER_HEALTH = 'CHECK_SERVER_HEALTH',
	}

	export enum ContentScript {
		OPEN_SIDEBAR = 'OPEN_SIDEBAR',
		CLOSE_SIDEBAR = 'CLOSE_SIDEBAR',
		TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',
	}
}
