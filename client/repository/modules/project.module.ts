import { z } from "zod"

import {
	ICopyListForm,
	ICreateListForm,
	IDeleteListForm,
	IProjectAddMemberForm,
	IProjectCreateForm,
	IProjectListResponse,
	IProjectMemberResponse,
	IProjectRemoveMemberForm,
	IProjectResponse,
	IProjectUpdateForm,
	IUpdateListTitleForm,
	IUpdateListsOrderForm
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

	listValidationSchema = z.object({
		title: z
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

	async getAllProjects(): Promise<IProjectResponse[]> {
		const res = await this.call<IProjectResponse[]>(
			"GET",
			`${this.URL}/by-team`
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

	async deleteProject(id: string): Promise<IProjectResponse> {
		const res = await this.call<IProjectResponse>(
			"PUT",
			`${this.URL}/delete/${id}`
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

	async createList(
		projectId: string,
		data: ICreateListForm
	): Promise<IProjectListResponse> {
		const res = await this.call<IProjectListResponse>(
			"POST",
			`${this.URL}/${projectId}`,
			data
		)

		return res
	}

	async copyList(
		projectId: string,
		data: ICopyListForm
	): Promise<IProjectListResponse> {
		const res = await this.call<IProjectListResponse>(
			"POST",
			`${this.URL}/copy-list/${projectId}`,
			data
		)

		return res
	}

	async updateListTitle(
		projectId: string,
		data: IUpdateListTitleForm
	): Promise<IProjectListResponse> {
		const res = await this.call<IProjectListResponse>(
			"PATCH",
			`${this.URL}/list-title/${projectId}`,
			data
		)

		return res
	}

	async updateListsOrder(
		projectId: string,
		data: IUpdateListsOrderForm
	): Promise<IProjectListResponse[]> {
		const res = await this.call<IProjectListResponse[]>(
			"PATCH",
			`${this.URL}/list-order/${projectId}`,
			data
		)

		return res
	}

	async deleteList(
		projectId: string,
		data: IDeleteListForm
	): Promise<IProjectListResponse> {
		const res = await this.call<IProjectListResponse>(
			"PUT",
			`${this.URL}/delete-list/${projectId}`,
			data
		)

		return res
	}
}

export default ProjectModule
