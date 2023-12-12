/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#E7FDED',
					100: '#CAFCD7',
					200: '#96F8AE',
					300: '#61F586',
					400: '#2CF15E',
					500: '#0ED840',
					600: '#0BAC33',
					700: '#088127',
					800: '#06561A',
					900: '#032B0D',
					950: '#021807'
				},
				secondary: {
					50: '#ECF6FE',
					100: '#D8EDFD',
					200: '#B2DBFB',
					300: '#90CBF9',
					400: '#69B9F7',
					500: '#42A8F5',
					600: '#0D8CED',
					700: '#0A6AB3',
					800: '#064574',
					900: '#03223A',
					950: '#02111D'
				},
				surface: {
					50: '#e1e6db',
					100: '#d5dece',
					200: '#c1cbb9',
					300: '#a1b096',
					400: '#717f66',
					500: '#5a6652',
					600: '#444e3b',
					700: '#32392d',
					800: '#262923',
					900: '#1c1e1a',
					950: '#010201'
				}
			}
		}
	},
	plugins: []
};
