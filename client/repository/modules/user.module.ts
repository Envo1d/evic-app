import type { IProfileResponse, IUser, TypeUserForm } from '~/types/user.types'
import HttpFactory from '../factory'

class UserModule extends HttpFactory {
	private URL = '/user'

	async getProfile(): Promise<IProfileResponse> {
		const res = await this.call<IProfileResponse>('GET', `${this.URL}/profile`)

		return res
	}

	async update(data: TypeUserForm) {
		const res = await this.call<IUser>('PUT', `${this.URL}/update`, data)

		return res
	}
}

export default UserModule
