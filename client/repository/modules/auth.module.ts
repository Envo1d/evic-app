import { email, minLength, object, string } from 'valibot'
import type { IAuthForm, IAuthResponse } from '~/types/auth.types'
import HttpFactory from '../factory'
import TokenModule from './token.module'

class AuthModule extends HttpFactory {
	private URL = '/auth'
	private tokenModule = new TokenModule()

	validationSchema = object({
		email: string('', [
			minLength(1, 'Email is required'),
			email('Invalid email'),
		]),
		password: string('', [minLength(6, 'Password too short')]),
	})

	async main(
		type: 'login' | 'register',
		data: IAuthForm
	): Promise<IAuthResponse> {
		const res = await this.call<IAuthResponse>(
			'POST',
			`${this.URL}/${type}`,
			data
		)

		if (res.accessToken) this.tokenModule.saveTokenStorage(res.accessToken)

		return res
	}

	async logout() {
		const res = await this.call<boolean>('POST', `${this.URL}/logout`)

		if (res) this.tokenModule.removeFromStorage()
		return res
	}
}

export default AuthModule
