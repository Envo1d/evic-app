import { IBase } from "./root.types"
import { ITaskResponse } from "./task.types"
import { ITeamMemberResponse, ITeamResponse } from "./team.types"
import { IUser } from "./user.types"

export interface IProjectResponse extends IBase {
	name: string
	description?: string
	imagePath?: string
	tasks?: ITaskResponse[]
	members?: IProjectMemberResponse[]
	owner: IUser
	team: ITeamResponse
}

export interface IProjectMemberResponse extends IBase {
	project: IProjectResponse
	teamMember: ITeamMemberResponse
}
