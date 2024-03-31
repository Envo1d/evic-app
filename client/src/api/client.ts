import axios, { type CreateAxiosDefaults } from 'axios'

import { errorCatch } from './error'
import { authService } from '@/services/auth.service'
import { getAccessToken, removeFromStorage } from '@/services/token.service'

const options: CreateAxiosDefaults = {
	// TODO: use env
	baseURL: 'http://localhost:7000/api',
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

axiosWithAuth.interceptors.response.use(
	config => config,
	async error => {
		const original = error.config

		if (
			(error?.response?.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			error.config &&
			!error.config._isRetry
		) {
			original._isRetry = true
			try {
				await authService.getNewTokens()
				return axiosWithAuth.request(original)
			} catch (error) {
				if (errorCatch(error) === 'jwt expired') removeFromStorage()
			}
		}

		throw error
	}
)

export { axiosClassic, axiosWithAuth }
