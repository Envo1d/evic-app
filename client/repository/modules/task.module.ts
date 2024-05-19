import { z } from "zod"

import type {
	ICreateTask,
	IDeleteTask,
	ITaskResponse,
	IUpdateTaskDescription,
	IUpdateTaskName,
	IUpdateTasksOrderOnList
} from "@/types/task.types"

import HttpFactory from "../factory"

class TaskModule extends HttpFactory {
	private URL = "/tasks"

	createValidationSchema = z.object({
		name: z.string().min(3, { message: "Title is too short" })
	})

	async createTask(
		projectId: string,
		data: ICreateTask
	): Promise<ITaskResponse> {
		const res = await this.call<ITaskResponse>(
			"POST",
			`${this.URL}/${projectId}`,
			data
		)

		return res
	}

	async updateTaskName(
		projectId: string,
		data: IUpdateTaskName
	): Promise<ITaskResponse> {
		const res = await this.call<ITaskResponse>(
			"PATCH",
			`${this.URL}/update-name/${projectId}`,
			data
		)

		return res
	}

	async updateTaskDescription(
		projectId: string,
		data: IUpdateTaskDescription
	): Promise<ITaskResponse> {
		const res = await this.call<ITaskResponse>(
			"PATCH",
			`${this.URL}/update-description/${projectId}`,
			data
		)

		return res
	}

	async updateTaskOrderOnList(
		projectId: string,
		data: IUpdateTasksOrderOnList
	): Promise<ITaskResponse[]> {
		const res = await this.call<ITaskResponse[]>(
			"PATCH",
			`${this.URL}/update-order-list/${projectId}`,
			data
		)

		return res
	}

	async deleteTask(projectId: string, data: IDeleteTask) {
		const res = await this.call("PUT", `${this.URL}/${projectId}`, data)

		return res
	}
}

export default TaskModule
