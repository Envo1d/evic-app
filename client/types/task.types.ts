import { ICommentResponse } from "./comment.types"
import { IProjectListResponse } from "./project.types"
import type { IBase } from "./root.types"
import { IUser } from "./user.types"

export enum EnumTaskPriority {
	low = "low",
	medium = "medium",
	high = "high"
}

export interface ITaskExecutorResponse extends IBase {
	task: ITaskResponse
	user: IUser
}

export interface ITaskResponse extends IBase {
	name: string
	priority?: EnumTaskPriority
	order: number
	status?: boolean
	description?: string
	imagePath: string
	deadline: string
	color?: string
	comments?: ICommentResponse[]
	taskExecutor?: ITaskExecutorResponse
	list: IProjectListResponse
	listId: string
}

export type TypeTaskFormState = Partial<Omit<ITaskResponse, "id" | "updatedAt">>
