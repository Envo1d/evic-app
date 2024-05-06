import {
	IDeleteProjectForm,
	IFindProjectForm,
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

	async getAllProjects(data: IFindProjectForm): Promise<IProjectResponse[]> {
		const res = await this.call<IProjectResponse[]>(
			"GET",
			`${this.URL}/by-team`,
			data
		)

		return res
	}

	async getProjectDetails(data: IFindProjectForm): Promise<IProjectResponse> {
		const res = await this.call<IProjectResponse>(
			"GET",
			`${this.URL}/details`,
			data
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
			"DELETE",
			`${this.URL}/${id}`,
			data
		)

		return res
	}

	async deleteMember(
		data: IProjectRemoveMemberForm
	): Promise<IProjectResponse> {
		const res = await this.call<IProjectResponse>(
			"DELETE",
			`${this.URL}/delete-member`,
			data
		)

		return res
	}
}

export default ProjectModule
