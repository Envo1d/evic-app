export default defineNuxtRouteMiddleware((to, from) => {
	const { $api } = useNuxtApp()

	const token = $api.token.getAccessToken()

	if (!token) {
		return navigateTo('/auth')
	}
})
