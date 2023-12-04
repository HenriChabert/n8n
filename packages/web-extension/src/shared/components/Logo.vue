<script lang="ts" setup>
import logoPath from '~/assets/n8n-logo.svg';
</script>

<template>
	<img :src="logoPath" :class="$style.img" alt="n8n.io" />
</template>

<style lang="scss" module>
.img {
	height: 32px;
}
</style>
