import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true,
	}),

	kit: {
		paths: {
			base: '/mreid-resolver',
		},
		adapter: adapter(),
		appDir: 'internal',
		trailingSlash: 'always',
	},
};

export default config;
