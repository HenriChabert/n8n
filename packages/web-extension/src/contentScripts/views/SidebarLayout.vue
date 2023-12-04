<script setup lang="ts">
import { useGlobalStore } from '~/shared/stores/global.store';
import N8nText from 'n8n-design-system/components/N8nText';

const globalStore = useGlobalStore();

const props = withDefaults(
	defineProps<{
		isOpened: boolean;
	}>(),
	{
		isOpened: false,
	},
);

defineEmits(['blur']);
</script>

<template>
	<div class="sidebar-layout" v-if="props.isOpened" @blur="$emit('blur', $event)">
		<slot></slot>

		<div class="footer">
			<n8n-text size="small" class="unofficial-disclaimer" align="center"
				>*This is an <b>unofficial</b> N8N extension</n8n-text
			>
			<n8n-text siz="small" class="version">{{ globalStore.version }}</n8n-text>
		</div>
	</div>
</template>

<style lang="scss">
$sidebar-width: 30vw;

.sidebar-layout {
	width: $sidebar-width;
	height: 100vh;
	position: fixed;
	right: 0;
	top: 0;
	background-color: var(--color-background-light);
	z-index: 10000;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	pointer-events: auto;
	padding: var(--spacing-m) var(--spacing-l) var(--spacing-m) var(--spacing-l);
}

.footer {
	position: absolute;
	width: 100%;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: var(--color-text-light);
	padding: inherit;

	.version {
		align-self: end;
	}
}
</style>
