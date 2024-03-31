import { IAuthForm, IAuthResponse } from '@/types/auth.types'

import { axiosClassic, axiosWithAuth } from '@/api/client'

import { removeFromStorage, saveTokenStorage } from './token.service'

class AuthService {
	private BASE_URL = '/auth'

	async main(type: 'login' | 'register', data: IAuthForm) {
		const res = await axiosClassic.post<IAuthResponse>(
			`${this.BASE_URL}/${type}`,
			data
		)

		if (res.data.accessToken) saveTokenStorage(res.data.accessToken)
		return res
	}

	async getNewTokens() {
		const res = await axiosClassic.post<IAuthResponse>(
			`${this.BASE_URL}/refresh-tokens`
		)

		if (res.data.accessToken) saveTokenStorage(res.data.accessToken)
		return res
	}

	async logout() {
		const res = await axiosWithAuth.post<boolean>(`${this.BASE_URL}/logout`)

		if (res.data) removeFromStorage()
		return res
	}
}

export const authService = new AuthService()
