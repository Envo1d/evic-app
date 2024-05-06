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

export interface ITeamInvitationsTable {
	invitationId?: string
	candidate?: {
		id?: string
		email?: string
		nickname?: string
		firstName?: string
		lastName?: string
		avatarPath?: string
	}
	candidateId?: string
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
	candidateEmail: string
	teamId: string
}

export interface ITeamRemoveMemberForm {
	memberId: string
	userId: string
}

export interface ITeamMemberTableData {
	user: ITeamMember
	role: {
		id: string
		name: string
	}
	joined: string
}

export interface ITeamMember {
	id: string
	nickname?: string
	email: string
	firstName?: string
	lastName?: string
	avatarPath?: string
	memberId?: string
}

export interface ITeamDeleteInviteForm {
	invitationId: string
	candidateId: string
	teamId: string
}
