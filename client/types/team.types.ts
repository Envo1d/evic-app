import { IProjectMemberResponse } from "./project.types"
import type { IBase } from "./root.types"
import { IUser } from "./user.types"

export enum EnumTeamRights {
	create_team = "create_team",
	create_project = "create_project",
	create_task = "create_task",
	create_role = "create_role",
	edit_team = "edit_team",
	edit_project = "edit_project",
	edit_task = "edit_task",
	edit_role = "edit_role",
	delete_team = "delete_team",
	delete_project = "delete_project",
	delete_task = "delete_task",
	delete_role = "delete_role",
	invite_member = "invite_member",
	delete_invited_member = "delete_invited_member",
	delete_member = "delete_member",
	set_member_project = "set_member_project",
	set_member_role = "set_member_role",
	set_task_executor = "set_task_executor",
	full_access = "full_access"
}

export interface IUserTeams {
	member: ITeamResponse[]
}

export interface ITeamResponse extends IBase {
	name: string
	creator: IUser
	creatorId: string
	members?: ITeamMemberResponse[]
	roles?: ITeamRoleResponse[]
}

export interface ITeamMemberResponse extends IBase {
	role: ITeamRoleResponse
	user: IUser
	userId: string
	team: ITeamResponse
	teamId: string
	projectMembership?: IProjectMemberResponse[]
}

export interface IActiveTeamMemberResponse extends IBase {
	activeTeamMemberId: string
	activeTeamId: string
	activeRole: {
		name: string
		rights: EnumTeamRights[]
		id: string
	}
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

export interface ITeamUpdateMemberRoleForm {
	memberId: string
	roleId: string
}

export interface ITeamAddMemberForm {
	candidateEmail: string
}

export interface ITeamRemoveMemberForm {
	memberId: string
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
}
