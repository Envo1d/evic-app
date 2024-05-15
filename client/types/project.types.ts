import { IBase } from "./root.types"
import { ITaskResponse } from "./task.types"
import { ITeamMemberResponse, ITeamResponse } from "./team.types"
import { IUser } from "./user.types"

export interface IProjectResponse extends IBase {
	name: string
	description?: string
	imageId: string
	imageThumbUrl: string
	imageFullUrl: string
	imageUserName: string
	imageLinkHTML: string
	lists?: IProjectListResponse[]
	members?: IProjectMemberResponse[]
	owner: IUser
	ownerId: string
	team: ITeamResponse
	teamId: string
}

export interface IProjectListResponse extends IBase {
	title: string
	order: number
	tasks: ITaskResponse[]
	project: IProjectResponse
	projectId: string
}

export interface IProjectMemberResponse extends IBase {
	project: IProjectResponse
	projectId: string
	teamMember: ITeamMemberResponse
	teamMemberId: string
}

export interface IProjectCreateForm {
	name: string
	teamId: string
	teamMemberId: string
	imagePath: string
}

export interface IFindProjectForm {
	projectId: string
	teamId: string
}

export interface IFindProjectsForm {
	teamId: string
}

export interface IDeleteProjectForm {
	teamId: string
}

export interface IProjectUpdateForm {
	name: string
	teamId: string
}

export interface IProjectAddMemberForm {
	teamMemberId: string
	projectId: string
}

export interface IProjectRemoveMemberForm {
	projectMemberId: string
	projectId: string
	teamId: string
}
