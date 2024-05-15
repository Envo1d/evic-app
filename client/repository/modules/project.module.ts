import { z } from "zod"

import {
	IDeleteProjectForm,
	IProjectAddMemberForm,
	IProjectCreateForm,
	IProjectMemberResponse,
	IProjectRemoveMemberForm,
	IProjectResponse,
	IProjectUpdateForm
} from "@/types/project.types"

import HttpFactory from "../factory"

class ProjectModule extends HttpFactory {
	private URL = "/project"

	createValidationSchema = z.object({
		name: z
			.string()
			.min(3, { message: "Minimum length of 3 letters is required" }),
		imagePath: z.string().min(1, { message: "Image not selected" })
	})
	updateValidationSchema = z.object({
		name: z
			.string()
			.min(3, { message: "Minimum length of 3 letters is required" })
	})

	async create(data: IProjectCreateForm): Promise<IProjectResponse> {
		const res = await this.call<IProjectResponse>("POST", `${this.URL}`, data)

		return res
	}

	async addMember(
		data: IProjectAddMemberForm
	): Promise<IProjectMemberResponse> {
		const res = await this.call<IProjectMemberResponse>(
			"POST",
			`${this.URL}/add-member`,
			data
		)

		return res
	}

	async getAllProjects(teamId: string): Promise<IProjectResponse[]> {
		const res = await this.call<IProjectResponse[]>(
			"GET",
			`${this.URL}/by-team/${teamId}`
		)

		return res
	}

	async getProjectDetails(id: string): Promise<IProjectResponse> {
		const res = await this.call<IProjectResponse>(
			"GET",
			`${this.URL}/details/${id}`
		)

		return res
	}

	async updateProject(
		id: string,
		data: IProjectUpdateForm
	): Promise<IProjectResponse> {
		const res = await this.call<IProjectResponse>(
			"PATCH",
			`${this.URL}/${id}`,
			data
		)

		return res
	}

	async deleteProject(
		id: string,
		data: IDeleteProjectForm
	): Promise<IProjectResponse> {
		const res = await this.call<IProjectResponse>(
			"PUT",
			`${this.URL}/delete/${id}`,
			data
		)

		return res
	}

	async deleteMember(
		data: IProjectRemoveMemberForm
	): Promise<IProjectResponse> {
		const res = await this.call<IProjectResponse>(
			"PUT",
			`${this.URL}/delete-member`,
			data
		)

		return res
	}
}

export default ProjectModule
