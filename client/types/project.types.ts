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
	teamMemberId: string
	imagePath: string
}

export interface IFindProjectForm {
	projectId: string
}

export interface IProjectUpdateForm {
	name: string
}

export interface IProjectAddMemberForm {
	teamMemberId: string
	projectId: string
}

export interface IProjectRemoveMemberForm {
	projectMemberId: string
	projectId: string
}

export interface ICreateListForm {
	title: string
}

export interface IUpdateListTitleForm {
	title: string
	listId: string
}

export interface ICopyListForm {
	listId: string
}

export interface IUpdateListOrderForm {
	oder: number
	listId: string
}

export interface IDeleteListForm {
	listId: string
}
