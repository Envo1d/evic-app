import type { IBase } from './root.types'

export interface IUser extends IBase {
	email: string
	nickname?: string
	firstName?: string
	lastName?: string

	workInterval?: number
	breakInterval?: number
	intervalsCount?: number
}

export interface IProfileResponse {
	user: IUser
	statistics: {
		label: string
		value: string
	}[]
}

export type TypeUserForm = Omit<IUser, 'id'> & { password?: string }
