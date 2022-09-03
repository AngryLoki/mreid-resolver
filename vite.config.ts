// eslint-disable-next-line n/file-extension-in-import
import {sveltekit} from '@sveltejs/kit/vite';
import type {UserConfig} from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
};

export default config;
