<script setup lang="ts">
import { ref } from 'vue'
import { sendMessage } from 'webext-bridge/popup';
import IN8nButton from 'n8n-design-system/components/N8nButton';

const loggedIn = ref(false);

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function isLoggedIn() {
    const isLoggedInResp = (await sendMessage('is-n8n-logged-in', {})) as any;
    loggedIn.value = isLoggedInResp.loggedIn;
    console.log(loggedIn.value);
}

isLoggedIn();

</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
		<IN8nButton>My button</IN8nButton>
    <div>Welcome to n8n extension</div>

    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>


  </main>
</template>
