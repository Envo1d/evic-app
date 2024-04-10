export default defineNuxtRouteMiddleware((to, from) => {
	const { $api } = useNuxtApp()

	const token = $api.token.getAccessToken()

	if (to.path !== '/' && !token && to.path !== '/auth') return navigateTo('/')
})
