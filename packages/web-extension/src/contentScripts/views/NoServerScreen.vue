<script setup lang="ts">
import { ref, onMounted } from 'vue';

import N8nHeading from 'n8n-design-system/components/N8nHeading';
import N8nText from 'n8n-design-system/components/N8nText';
import N8nFormInput from 'n8n-design-system/components/N8nFormInput';
import N8nButton from 'n8n-design-system/components/N8nButton';

import Logo from '~/shared/components/Logo.vue';
import { useUsersStore } from '~/shared/stores/user.store';

const usersStore = useUsersStore();

const isButtonLoading = ref(false);
const tempServerUrl = ref(undefined) as Ref<string | undefined>;

function onStartHandler() {
	isButtonLoading.value = true;
	usersStore.setStoreUrl(tempServerUrl.value);
	setTimeout(() => {
		isButtonLoading.value = false;
	}, 3000);
}

onMounted(async () => {
	tempServerUrl.value = await usersStore.serverUrl;
});
</script>

<template>
	<div class="no-server-container">
		<div class="heading">
			<Logo></Logo>
			<n8n-heading align="center" size="2xlarge">Welcome to n8n Web Extension</n8n-heading>
		</div>
		<div class="server-url-form">
			<div class="intro-text">
				<n8n-text align="center" size="large"
					>To start, please define the URL of your server</n8n-text
				>
			</div>
			<n8n-form-input
				class="server-url-input"
				name="serverUrl"
				label="Server URL"
				:clearable="true"
				v-model="tempServerUrl"
				:validateOnBlur="true"
				placeholder="Example: moba.app.n8n.cloud"
			>
			</n8n-form-input>
			<n8n-button
				size="large"
				label="Start !"
				:loading="isButtonLoading"
				@click="onStartHandler"
			></n8n-button>
		</div>
	</div>
</template>

<style lang="scss">
.no-server-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.heading {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-s);
	align-items: center;
	justify-content: space-around;
	max-height: 33%;
	flex: 0 0 33%;
}

.server-url-form {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: start;
	gap: var(--spacing-l);
	width: 60%;
	max-height: 50%;
	flex: 0 0 50%;
}

.server-url-input {
	width: 100%;
}

.intro-text {
	text-align: center;
}
</style>
