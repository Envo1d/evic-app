import { minLength, object, string } from "valibot"

import {
	ITeamAddMemberForm,
	ITeamCreateForm,
	ITeamCreateRoleForm,
	ITeamInviteResponse,
	ITeamMemberResponse,
	ITeamRemoveMemberForm,
	ITeamResponse,
	ITeamRoleResponse,
	ITeamSetMemberRoleForm,
	ITeamUpdateMemberRoleForm,
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

	async getTeamRoles(id: string): Promise<ITeamRoleResponse[]> {
		const res = await this.call<ITeamRoleResponse[]>(
			"GET",
			`${this.URL}/team-roles/${id}`
		)

		return res
	}

	async setMemberRole(
		data: ITeamSetMemberRoleForm
	): Promise<ITeamMemberResponse> {
		const res = await this.call<ITeamMemberResponse>(
			"POST",
			`${this.URL}/set-role`,
			data
		)

		return res
	}

	async updateMemberRole(
		data: ITeamUpdateMemberRoleForm
	): Promise<ITeamMemberResponse> {
		const res = await this.call<ITeamMemberResponse>(
			"POST",
			`${this.URL}/update-role`,
			data
		)

		return res
	}

	async inviteMember(data: ITeamAddMemberForm): Promise<ITeamInviteResponse> {
		const res = await this.call<ITeamInviteResponse>(
			"POST",
			`${this.URL}/invite-member`,
			data
		)

		return res
	}

	async acceptInvite(inviteId: string): Promise<boolean> {
		const res = await this.call<boolean>(
			"PUT",
			`${this.URL}/accept-invite/${inviteId}`
		)

		return res
	}

	async declineInvite(inviteId: string): Promise<boolean> {
		const res = await this.call<boolean>(
			"PUT",
			`${this.URL}/decline-invite/${inviteId}`
		)

		return res
	}

	async getTeamInvitations(id: string): Promise<ITeamInviteResponse[]> {
		const res = await this.call<ITeamInviteResponse[]>(
			"GET",
			`${this.URL}/invitations/${id}`
		)

		return res
	}

	async getUserInvitations(): Promise<ITeamInviteResponse[]> {
		const res = await this.call<ITeamInviteResponse[]>(
			"GET",
			`${this.URL}/user-invitations`
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

	async leaveTeam(teamId: string, data: ITeamRemoveMemberForm) {
		const res = await this.call(
			"DELETE",
			`${this.URL}/leave-team/${teamId}`,
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
