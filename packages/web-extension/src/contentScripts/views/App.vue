<script setup lang="ts">
import { ref } from 'vue';
import { onMessage } from 'webext-bridge/content-script';
import { useToggle } from '@vueuse/core';
import NoServerScreen from './NoServerScreen.vue';
import SidebarLayout from './SidebarLayout.vue';

import 'n8n-design-system/css/index.scss';
const [showSidebar, toggleSidebar] = useToggle(false);

const root = ref(null);

function closeSidebar() {
	console.log('Closing sidebar');
	toggleSidebar(false);
}

function isClickOnThis(e: MouseEvent) {
	return root.value && e.composedPath().includes(root.value);
}

document.addEventListener('click', (e) => {
	if (!isClickOnThis(e)) {
		closeSidebar();
	}
});

onMessage('TOGGLE_SIDEBAR', () => {
	console.log('Message received');
	toggleSidebar();
});
</script>

<template>
	<div class="app-container" ref="root">
		<SidebarLayout :is-opened="showSidebar" @blur="closeSidebar">
			<NoServerScreen> </NoServerScreen>
		</SidebarLayout>
	</div>
</template>

<style lang="scss">
.app-container {
	position: fixed;
	left: 0;
	top: 0;
	height: 100vh;
	width: 100vw;
	pointer-events: none;
	background-color: transparent;
	z-index: 10000;
}
</style>
