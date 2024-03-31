import { ITaskResponse, TypeTaskFormState } from '@/types/task.types'

import { axiosWithAuth } from '@/api/client'

class TaskService {
	private BASE_URL = '/tasks'

	async getTasks() {
		const res = await axiosWithAuth.get<ITaskResponse[]>(`${this.BASE_URL}`)

		return res
	}

	async createTask(data: TypeTaskFormState) {
		const res = await axiosWithAuth.post(this.BASE_URL, data)

		return res
	}

	async updateTask(id: string, data: TypeTaskFormState) {
		const res = await axiosWithAuth.put(`${this.BASE_URL}/${id}`, data)

		return res
	}

	async deleteTask(id: string) {
		const res = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)

		return res
	}
}

export const taskService = new TaskService()
