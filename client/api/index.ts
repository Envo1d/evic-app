import { $fetch, type FetchOptions, ofetch } from "ofetch"

import type { IApiInstance } from "@/types/root.types"

import AuthModule from "@/repository/modules/auth.module"
import ProjectModule from "@/repository/modules/project.module"
import TaskModule from "@/repository/modules/task.module"
import TeamModule from "@/repository/modules/team.module"
import TimerModule from "@/repository/modules/timer.module"
import TokenModule from "@/repository/modules/token.module"
import UserModule from "@/repository/modules/user.module"

const tokenModule = new TokenModule()

const fetchOptions: FetchOptions = {
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	credentials: "include",
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
			const res = await ofetch("/auth/refresh-tokens", {
				baseURL: process.env.NEXT_PUBLIC_API_URL,
				method: "POST",
				credentials: "include"
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
	task: new TaskModule(apiFetcher),
	team: new TeamModule(apiFetcher),
	project: new ProjectModule(apiFetcher)
}

export default api
