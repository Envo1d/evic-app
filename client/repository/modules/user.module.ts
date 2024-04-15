import {
	email,
	maxValue,
	minLength,
	minValue,
	number,
	object,
	optional,
	string,
} from 'valibot'
import type { IProfileResponse, IUser, TypeUserForm } from '~/types/user.types'
import HttpFactory from '../factory'

class UserModule extends HttpFactory {
	private URL = '/user'

	settingsValidationSchema = object({
		email: string('', [
			minLength(1, 'Email is required'),
			email('Invalid email'),
		]),
		password: optional(string('', [minLength(6, 'Password too short')])),
		nickname: optional(
			string('', [minLength(3, 'Nickname must be at least 3 chars')])
		),
		firstName: optional(
			string('', [minLength(3, 'First name must be at least 3 chars')])
		),
		lastName: optional(
			string('', [minLength(3, 'Last name must be at least 3 chars')])
		),
		breakInterval: optional(number('', [minValue(1, 'Min interval is 1')])),
		intervalsCount: optional(
			number('', [
				minValue(1, 'Min intervals is 1'),
				maxValue(10, 'Max intervals is 10'),
			])
		),
		workInterval: optional(number('', [minValue(1, 'Min interval is 1')])),
	})

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
