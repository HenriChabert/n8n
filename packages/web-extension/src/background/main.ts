import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'
import N8NApiHandler from '../shared/n8n-api'
import { storageN8NUrl } from '@/logic/storage'

// only on dev mode
if (import.meta.hot) {
    // @ts-expect-error for background HMR
    import('/@vite/client')
    // load latest content script
    import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
    // eslint-disable-next-line no-console
    console.log('Extension installed')
})

let previousTabId = 0

const n8nApi = new N8NApiHandler("https://n8n.app-moba.com/");
initN8nApi();
const loginResponse = n8nApi.login().then((resp) => {
    console.log(resp);
});

const workflowsResponse = n8nApi.listWorkflows().then((resp) => {
    console.log(resp);
});


// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
    if (!previousTabId) {
        previousTabId = tabId
        return
    }

    let tab: Tabs.Tab

    try {
        tab = await browser.tabs.get(previousTabId)
        previousTabId = tabId
    }
    catch {
        return
    }

    // eslint-disable-next-line no-console
    console.log('previous tab', tab)
    sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})

async function requestN8nServerPermissions(n8nServerUrl: string) {
    const isPermissionGranted = await browser.permissions.request({
        origins: [n8nServerUrl]
    });
    if (isPermissionGranted) {
        console.log("Granted");
    } else {
        console.log("Not Granted");
    }

}

async function initN8nApi() {
    const serverUrl = storageN8NUrl.value;
    if (serverUrl === null) {
        console.debug("No server URL found in storage.")
        return;
    }
    n8nApi.setBaseURL(serverUrl);
}

onMessage('get-current-tab', async () => {
    try {
        const tab = await browser.tabs.get(previousTabId)
        return {
            title: tab?.title,
        }
    }
    catch {
        return {
            title: undefined,
        }
    }
})

onMessage('assign-server-url', async (message) => {
    const data = message.data as any;
    if (!data) {
        return;
    }

    const serverUrl = data.serverUrl as string;
    await requestN8nServerPermissions(serverUrl);
    n8nApi.setBaseURL(serverUrl);
})

onMessage('is-n8n-logged-in', async () => {
    const loginResponse = await n8nApi.login();
    console.log(loginResponse);
    return {
        loggedIn: loginResponse !== undefined
    }
})
