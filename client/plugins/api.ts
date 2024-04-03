import { $fetch, ofetch, type FetchOptions } from 'ofetch'
import useApiUrl from '~/composables/useApiUrl'
import AuthModule from '~/repository/modules/auth.module'
import TaskModule from '~/repository/modules/task.module'
import TimeBlockModule from '~/repository/modules/time-block.module'
import TimerModule from '~/repository/modules/timer.module'
import TokenModule from '~/repository/modules/token.module'
import UserModule from '~/repository/modules/user.module'
import type { IApiInstance } from '~/types/root.types'

export default defineNuxtPlugin(nuxtApp => {
	const tokenModule = new TokenModule()

	const fetchOptions: FetchOptions = {
		baseURL: useApiUrl(),
		credentials: 'include',
		async onRequest({ options }) {
			const accessToken = tokenModule.getAccessToken()
			if (accessToken) {
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${accessToken}`,
				}
			}
		},
		async onResponse({ response }) {
			if (response.status === 401) {
				const res = await ofetch('/auth/refresh-tokens', {
					baseURL: useApiUrl(),
					method: 'POST',
					credentials: 'include',
				})

				if (res.status === 401) {
					tokenModule.removeFromStorage()
				} else {
					tokenModule.saveTokenStorage(res.accessToken)
				}
			}
		},
	}

	const apiFetcher = $fetch.create(fetchOptions)

	const modules: IApiInstance = {
		token: tokenModule,
		auth: new AuthModule(apiFetcher),
		user: new UserModule(apiFetcher),
		timer: new TimerModule(apiFetcher),
		timeBlock: new TimeBlockModule(apiFetcher),
		task: new TaskModule(apiFetcher),
	}

	return {
		provide: {
			api: modules,
		},
	}
})
