<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToggle } from '@vueuse/core';

import N8nHeading from 'n8n-design-system/components/N8nHeading';
import N8nText from 'n8n-design-system/components/N8nText';
import N8nFormInput from 'n8n-design-system/components/N8nFormInput';
import N8nButton from 'n8n-design-system/components/N8nButton';

import type { Rule, RuleGroup } from 'n8n-design-system/types';
import type { Validatable } from 'n8n-design-system/types/form';

import Logo from '~/shared/components/Logo.vue';
import { useUsersStore } from '~/shared/stores/user.store';

import { ServerHealth } from '~/Interface';

const usersStore = useUsersStore();

const [isButtonLoading, toggleButtonLoading] = useToggle(false);
const [validationWarningsShown, toggleValidationWarnings] = useToggle(false);
const [isFormValid, toggleFormValid] = useToggle(false);

const tempServerUrl = ref(undefined) as Ref<string | undefined>;
const serverHealthError = ref(undefined) as Ref<string | undefined>;

const urlRegex =
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/i;

const serverUrlValidationRules: Array<Rule | RuleGroup> = [
	{ name: 'REQUIRED' },
	{
		name: 'SERVER_IS_UP',
	},
	{
		name: 'MATCH_REGEX',
		config: {
			regex: urlRegex,
			message: 'Provided URL is not valid.',
		},
	},
];

async function checkServerHealth(serverHealth: ServerHealth) {
	if (serverHealth !== ServerHealth.UP) {
		serverHealthError.value = 'This URL is invalid.';
		if (serverHealth === ServerHealth.DOWN) {
			serverHealthError.value =
				'Server does not respond. Please check the URL is valid and the server is up';
		} else if (serverHealth === ServerHealth.NO_URL) {
			serverHealthError.value = 'No URL provided';
		}
	}
}

function validateServerHealth(value: Validatable) {
	if (serverHealthError.value === undefined) {
		return false;
	}
	toggleValidationWarnings(true);
	toggleFormValid(false);
	return {
		messageKey: '',
		message: serverHealthError.value,
	};
}

async function onSubmitHandler() {
	toggleButtonLoading(true);
	toggleValidationWarnings(false);
	const { serverHealth } = await usersStore.setStoreUrl(tempServerUrl.value);
	await checkServerHealth(serverHealth);
	if (serverHealthError.value !== undefined) {
		toggleValidationWarnings(true);
	}
	toggleButtonLoading(false);
}

function validateServerUrlInput(shouldValidate: boolean) {
	if (shouldValidate) {
		toggleFormValid(true);
	} else {
		toggleFormValid(false);
	}
}

function resetServerHealthError() {
	serverHealthError.value = undefined;
	toggleValidationWarnings(false);
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
				placeholder="Example: moba.app.n8n.cloud"
				:validators="{
					SERVER_IS_UP: {
						validate: validateServerHealth,
					},
				}"
				:validationRules="serverUrlValidationRules"
				:showValidationWarnings="validationWarningsShown"
				:showRequiredAsterisk="true"
				@validate="validateServerUrlInput"
				@update:modelValue="resetServerHealthError"
				required
			>
			</n8n-form-input>
			<n8n-button
				size="large"
				label="Start !"
				:loading="isButtonLoading"
				@click="onSubmitHandler"
				:disabled="!isFormValid"
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
