import { minLength, object, string } from "valibot"

import {
	ITeamAddMemberForm,
	ITeamCreateForm,
	ITeamCreateRoleForm,
	ITeamMemberResponse,
	ITeamRemoveMemberForm,
	ITeamResponse,
	ITeamRoleResponse,
	IUserTeams
} from "@/types/team.types"

import HttpFactory from "../factory"

class TeamModule extends HttpFactory {
	private URL = "/team"

	createTeamValidationSchema = object({
		name: string("", [minLength(3, "Name is too short")])
	})

	async createTeam(data: ITeamCreateForm): Promise<ITeamResponse> {
		const res = await this.call<ITeamResponse>(
			"POST",
			`${this.URL}/create`,
			data
		)

		return res
	}

	async createTeamRole(data: ITeamCreateRoleForm): Promise<ITeamRoleResponse> {
		const res = await this.call<ITeamRoleResponse>(
			"POST",
			`${this.URL}/create-role`,
			data
		)

		return res
	}

	async addTeamMember(data: ITeamAddMemberForm): Promise<ITeamMemberResponse> {
		const res = await this.call<ITeamMemberResponse>(
			"POST",
			`${this.URL}/add-member`,
			data
		)

		return res
	}

	async removeMember(teamId: string, data: ITeamRemoveMemberForm) {
		const res = await this.call(
			"DELETE",
			`${this.URL}/remove-member/${teamId}`,
			data
		)

		return res
	}

	async getUserTeams(): Promise<IUserTeams> {
		const res = await this.call<IUserTeams>("GET", `${this.URL}/user-teams`)

		return res
	}

	async getTeamDetails(id: string): Promise<ITeamResponse> {
		const res = await this.call<ITeamResponse>("GET", `${this.URL}/${id}`)

		return res
	}

	async getTeamRoles(id: string): Promise<ITeamRoleResponse[]> {
		const res = await this.call<ITeamRoleResponse[]>(
			"GET",
			`${this.URL}/team-roles/${id}`
		)

		return res
	}

	async updateTeam(id: string, data: ITeamCreateForm): Promise<ITeamResponse> {
		const res = await this.call<ITeamResponse>("PUT", `${this.URL}/${id}`, data)

		return res
	}

	async deleteTeam(id: string) {
		const res = await this.call("DELETE", `${this.URL}/${id}`)

		return res
	}
}

export default TeamModule
