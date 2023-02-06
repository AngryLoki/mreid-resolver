import adapter from '@sveltejs/adapter-static';
import {vitePreprocess} from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		paths: {
			base: '/mreid-resolver',
		},
		adapter: adapter(),
		appDir: 'internal',
	},
};

export default config;
