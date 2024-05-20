import { ICommentResponse } from "./comment.types"
import { IProjectListResponse, IProjectMemberResponse } from "./project.types"
import type { IBase } from "./root.types"

export enum EnumTaskPriority {
	low = "low",
	medium = "medium",
	high = "high"
}

export interface ITaskExecutorResponse extends IBase {
	task?: ITaskResponse
	user?: IProjectMemberResponse
}

export interface ITaskResponse extends IBase {
	name: string
	priority?: EnumTaskPriority
	order: number
	status?: boolean
	description?: string
	imagePath?: string
	deadline?: string
	color?: string
	comments?: ICommentResponse[]
	taskExecutor?: ITaskExecutorResponse
	list: IProjectListResponse
	listId: string
}

export type TypeTaskFormState = Partial<Omit<ITaskResponse, "id" | "updatedAt">>

export interface ICreateTask {
	name: string
	listId: string
}

export interface IUpdateTaskName {
	name: string
	listId: string
	taskId: string
}

export interface IUpdateTaskDescription {
	description: string
	listId: string
	taskId: string
}

export interface IDeleteTask {
	listId: string
	taskId: string
}

export interface IUpdateTasksOrderOnList {
	tasks: {
		id: string
		listId: string
		order: number
	}[]
}

export interface ICopyTaskForm {
	taskId: string
	listId: string
}
