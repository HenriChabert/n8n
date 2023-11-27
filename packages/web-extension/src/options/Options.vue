<script setup lang="ts">
import { storageN8NUrl } from '~/logic/storage'
import { sendMessage } from 'webext-bridge/options';

function onServerUrlAssigned (serverUrl: string|null) {
    if (!serverUrl) {
        return;
    }
    sendMessage('assign-server-url', {
        serverUrl: serverUrl
    }, "background")
}

</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <img src="/assets/icon.svg" class="icon-btn mx-2 text-2xl" alt="extension icon">
    <div>Options</div>

    <label>N8N server URL: </label>
    <input v-model="storageN8NUrl" class="border border-gray-400 rounded px-2 py-1 mt-2">
    <button @click="onServerUrlAssigned(storageN8NUrl)">Submit</button>

    <div class="mt-4">
      Powered by Vite <pixelarticons-zap class="align-middle inline-block" />
    </div>
  </main>
</template>
