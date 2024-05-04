import type { IBase } from "./root.types"

export interface IUser extends IBase {
	email: string
	nickname?: string
	firstName?: string
	lastName?: string
	avatarPath?: string

	workInterval?: number
	breakInterval?: number
	intervalsCount?: number
}

export interface IProfileResponse extends IUser {}

export type TypeUserForm = Omit<IUser, "id"> & { password?: string }
