import { IProfileResponse, TypeUserForm } from '@/types/user.types'

import { axiosWithAuth } from '@/api/client'

class UserService {
	private BASE_URL = '/user'

	async getProfile() {
		const res = await axiosWithAuth.get<IProfileResponse>(
			`${this.BASE_URL}/profile`
		)

		return res.data
	}

	async update(data: TypeUserForm) {
		const res = await axiosWithAuth.put(`${this.BASE_URL}/update`, data)

		return res
	}
}

export const userService = new UserService()
