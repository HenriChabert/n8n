import { dirname, relative } from 'node:path';
import { resolve } from 'path';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { isDev, port, r } from './scripts/utils';
import packageJson from './package.json';

const alias = [
	{ find: '~', replacement: resolve(__dirname, 'src') },
	{
		find: '@/',
		replacement: resolve(__dirname, '..', 'design-system', 'src') + '/',
	},
	{
		find: /^n8n-design-system$/,
		replacement: resolve(__dirname, '..', 'design-system', 'src', 'main.ts'),
	},
	{
		find: /^n8n-design-system\//,
		replacement: resolve(__dirname, '..', 'design-system', 'src') + '/',
	},
];

export const sharedConfig: UserConfig = {
	root: r('src'),
	resolve: { alias },
	define: {
		__DEV__: isDev,
		__NAME__: JSON.stringify(packageJson.name),
	},
	plugins: [
		Vue(),

		AutoImport({
			imports: [
				'vue',
				{
					'webextension-polyfill': [['*', 'browser']],
				},
			],
		}),
		// rewrite assets to use relative path
		{
			name: 'assets-rewrite',
			enforce: 'post',
			apply: 'build',
			transformIndexHtml(html, { path }) {
				return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`);
			},
		},
	],
	optimizeDeps: {
		include: ['vue', '@vueuse/core', 'webextension-polyfill'],
		exclude: ['vue-demi'],
	},
	build: {
		minify: 'terser',
		terserOptions: {
			mangle: false,
			format: { ascii_only: true },
		},
	},
};

export default defineConfig(({ command }) => ({
	...sharedConfig,
	base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
	server: {
		port,
		hmr: {
			host: 'localhost',
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '\n@use "~/web-extension-variables.scss" as *;\n',
			},
		},
	},
	build: {
		watch: isDev ? {} : undefined,
		outDir: r('extension/dist'),
		emptyOutDir: false,
		sourcemap: isDev ? 'inline' : false,
		// https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
		rollupOptions: {
			input: {
				options: r('src/options/index.html'),
				popup: r('src/popup/index.html'),
			},
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
	},
}));
