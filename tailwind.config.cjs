/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},

		fontFamily: {
			sans: ['Arial', 'Helvetica', 'sans-serif'],
		},
	},
	plugins: [],
	experimental: {
		optimizeUniversalDefaults: true,
	},
};
