import { IProjectMemberResponse } from "./project.types"
import type { IBase } from "./root.types"
import { IUser } from "./user.types"

export enum EnumTeamRights {
	create = "create",
	edit = "edit",
	delete = "delete",
	add_member = "add_member",
	edit_member = "edit_member",
	delete_member = "delete_member"
}

export interface IUserTeams {
	createdByUser: ITeamResponse[]
	member: ITeamResponse[]
}

export interface ITeamResponse extends IBase {
	name: string
	creator: IUser
	creatorId: string
	members?: ITeamMemberResponse[]
	roles?: ITeamRoleResponse[]
	projects?: number
}

export interface ITeamMemberResponse extends IBase {
	role: ITeamRoleResponse
	user: IUser
	team: ITeamResponse
	projectMembership?: IProjectMemberResponse[]
}

export interface ITeamRoleResponse extends IBase {
	name: string
	rights: EnumTeamRights[]
	members?: ITeamMemberResponse[]
	teamId: string
}

export interface ITeamCreateForm {
	name: string
}

export type TypeTeamCreateFormState = Partial<ITeamCreateForm>

export interface ITeamCreateRoleForm {
	name: string
	rights: EnumTeamRights[]
	teamId: string
}

export type TypeTeamCreateRoleFormState = Partial<ITeamCreateRoleForm>

export interface ITeamInviteResponse extends IBase {
	candidateId?: string
	candidate?: IUser
	team?: ITeamResponse
	teamId?: string
}

export interface ITeamSetMemberRoleForm {
	userId: string
	teamId: string
	roleId: string
}

export interface ITeamUpdateMemberRoleForm {
	memberId: string
	teamId: string
	roleId: string
}

export interface ITeamAddMemberForm {
	candidateId: string
	teamId: string
}

export interface ITeamRemoveMemberForm {
	memberId: string
	userId: string
}
