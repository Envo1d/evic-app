import type { ITaskResponse, TypeTaskFormState } from '@/types/task.types'

import HttpFactory from '../factory'

class TaskModule extends HttpFactory {
	private URL = '/tasks'

	async getTasks(): Promise<ITaskResponse[]> {
		const res = await this.call<ITaskResponse[]>('GET', `${this.URL}`)

		return res
	}

	async createTask(data: TypeTaskFormState): Promise<ITaskResponse> {
		data.deadline = data.createdAt
		const res = await this.call<ITaskResponse>('POST', `${this.URL}`, data)

		return res
	}

	async updateTask(
		id: string,
		data: TypeTaskFormState
	): Promise<ITaskResponse> {
		const res = await this.call<ITaskResponse>('PUT', `${this.URL}/${id}`, data)

		return res
	}

	async deleteTask(id: string) {
		const res = await this.call('DELETE', `${this.URL}/${id}`)

		return res
	}
}

export default TaskModule
