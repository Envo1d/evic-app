// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	modules: [
		'@nuxtjs/tailwindcss',
		'@nuxtjs/color-mode',
		'shadcn-nuxt',
		'@nuxtjs/i18n',
		'@nuxtjs/google-fonts',
		'@nuxt/image',
		'@vee-validate/nuxt',
		'@hebilicious/vue-query-nuxt',
		'@formkit/auto-animate/nuxt',
	],

	runtimeConfig: {
		public: {
			apiUrl: process.env.API_URL,
			node: process.env.NODE_ENV,
		},
	},
	routeRules: {
		'/': { ssr: true },
		'/auth': { ssr: false },
		'/app/**': { ssr: false },
	},

	css: ['~/assets/css/tailwind.css'],
	tailwindcss: {
		cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'first' }],
		configPath: 'tailwind.config',
		exposeConfig: {
			level: 2,
		},
		config: {},
		viewer: true,
	},
	shadcn: {
		prefix: 'Gen',
		componentDir: './components/gen',
	},
	colorMode: {
		classSuffix: '',
		preference: 'system',
		fallback: 'light',
	},
})
