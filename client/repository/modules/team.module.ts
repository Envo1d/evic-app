import { z } from "zod"

import {
	IActiveTeamMemberResponse,
	ITeamAddMemberForm,
	ITeamCreateForm,
	ITeamCreateRoleForm,
	ITeamDeleteInviteForm,
	ITeamInviteResponse,
	ITeamMemberResponse,
	ITeamRemoveMemberForm,
	ITeamResponse,
	ITeamRoleResponse,
	ITeamUpdateMemberRoleForm,
	IUserTeams
} from "@/types/team.types"

import HttpFactory from "../factory"

class TeamModule extends HttpFactory {
	private URL = "/team"

	createTeamValidationSchema = z.object({
		name: z.string().min(3, { message: "Name is too short" })
	})

	createRoleValidationSchema = z.object({
		name: z.string().min(3, { message: "Name is too short" }),
		rights: z
			.string()
			.array()
			.min(1, { message: "One position from the rights is required" })
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

	async getTeamRoles(): Promise<ITeamRoleResponse[]> {
		const res = await this.call<ITeamRoleResponse[]>("GET", `${this.URL}/roles`)

		return res
	}

	async updateMemberRole(
		data: ITeamUpdateMemberRoleForm
	): Promise<ITeamMemberResponse> {
		const res = await this.call<ITeamMemberResponse>(
			"PATCH",
			`${this.URL}/update-member-role`,
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
			"DELETE",
			`${this.URL}/decline-invite/${inviteId}`
		)

		return res
	}

	async deleteInvite(data: ITeamDeleteInviteForm): Promise<boolean> {
		const res = await this.call<boolean>(
			"PUT",
			`${this.URL}/delete-invite`,
			data
		)

		return res
	}

	async getTeamInvitations(): Promise<ITeamInviteResponse[]> {
		const res = await this.call<ITeamInviteResponse[]>(
			"GET",
			`${this.URL}/invitations`
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

	async removeMember(data: ITeamRemoveMemberForm) {
		const res = await this.call("PUT", `${this.URL}/remove-member`, data)

		return res
	}

	async leaveTeam(data: ITeamRemoveMemberForm) {
		const res = await this.call("PUT", `${this.URL}/leave-team`, data)

		return res
	}

	async getUserTeams(): Promise<IUserTeams> {
		const res = await this.call<IUserTeams>("GET", `${this.URL}/user-teams`)

		return res
	}

	async getTeamDetails(): Promise<ITeamResponse> {
		const res = await this.call<ITeamResponse>("GET", `${this.URL}`)

		return res
	}

	async updateTeam(data: ITeamCreateForm): Promise<ITeamResponse> {
		const res = await this.call<ITeamResponse>("PUT", `${this.URL}`, data)

		return res
	}

	async deleteTeam() {
		const res = await this.call("DELETE", `${this.URL}`)

		return res
	}

	async setActiveTeam(id: string): Promise<IActiveTeamMemberResponse> {
		const res = await this.call<IActiveTeamMemberResponse>(
			"PUT",
			`${this.URL}/set-active-team/${id}`
		)

		return res
	}

	async getActiveTeam(): Promise<IActiveTeamMemberResponse> {
		const res = await this.call<IActiveTeamMemberResponse>(
			"GET",
			`${this.URL}/get-active-team`
		)

		return res
	}

	async deleteTeamRole(id: string) {
		const res = await this.call("DELETE", `${this.URL}/delete-role/${id}`)

		return res
	}

	async updateTeamRole(
		id: string,
		data: ITeamCreateRoleForm
	): Promise<ITeamRoleResponse> {
		const res = await this.call<ITeamRoleResponse>(
			"PATCH",
			`${this.URL}/update-role/${id}`,
			data
		)

		return res
	}
}

export default TeamModule
