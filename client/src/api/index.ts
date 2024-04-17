import { $fetch, type FetchOptions, ofetch } from 'ofetch'

import type { IApiInstance } from '@/types/root.types'

import AuthModule from '@/repository/modules/auth.module'
import TaskModule from '@/repository/modules/task.module'
import TimeBlockModule from '@/repository/modules/time-block.module'
import TimerModule from '@/repository/modules/timer.module'
import TokenModule from '@/repository/modules/token.module'
import UserModule from '@/repository/modules/user.module'

const tokenModule = new TokenModule()

const fetchOptions: FetchOptions = {
	// TODO: to env
	baseURL: 'http://localhost:7000/api',
	credentials: 'include',
	async onRequest({ options }) {
		const accessToken = tokenModule.getAccessToken()
		if (accessToken) {
			options.headers = {
				...options.headers,
				Authorization: `Bearer ${accessToken}`
			}
		}
	},
	async onResponse({ response }) {
		if (response.status === 401) {
			const res = await ofetch('/auth/refresh-tokens', {
				// TODO: to env
				baseURL: 'http://localhost:7000/api',
				method: 'POST',
				credentials: 'include'
			})

			if (res.status === 401) {
				tokenModule.removeFromStorage()
			} else {
				tokenModule.saveTokenStorage(res.accessToken)
			}
		}
	}
}

const apiFetcher = $fetch.create(fetchOptions)

const api: IApiInstance = {
	token: tokenModule,
	auth: new AuthModule(apiFetcher),
	user: new UserModule(apiFetcher),
	timer: new TimerModule(apiFetcher),
	timeBlock: new TimeBlockModule(apiFetcher),
	task: new TaskModule(apiFetcher)
}

export default api
