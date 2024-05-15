import { UseGuards, applyDecorators } from '@nestjs/common'
import { Rights } from '@prisma/client'
import { JwtAuthGuard } from '../../auth/guards/jwt.guard'
import {
	CreateProjectRightsGuard,
	CreateRoleRightsGuard,
	CreateTaskRightsGuard,
	CreateTeamRightsGuard,
	DeleteInvitedMemberRightsGuard,
	DeleteMemberRightsGuard,
	DeleteProjectRightsGuard,
	DeleteRoleRightsGuard,
	DeleteTaskRightsGuard,
	DeleteTeamRightsGuard,
	EditProjectRightsGuard,
	EditRoleRightsGuard,
	EditTaskRightsGuard,
	EditTeamRightsGuard,
	InviteMemberRightsGuard,
	SetMemberProjectRightsGuard,
	SetMemberRoleRightsGuard,
	SetTaskExecutorRightsGuard
} from '../guards'
import { MemberGuard } from '../guards/member.guard'

export const AuthTeamMember = (rights: Rights[] = []) => {
	if (rights.length > 0) {
		const guards = []

		if (rights.includes(Rights.create_team)) guards.push(CreateTeamRightsGuard)
		if (rights.includes(Rights.create_role)) guards.push(CreateRoleRightsGuard)
		if (rights.includes(Rights.create_task)) guards.push(CreateTaskRightsGuard)
		if (rights.includes(Rights.create_project))
			guards.push(CreateProjectRightsGuard)
		if (rights.includes(Rights.delete_invited_member))
			guards.push(DeleteInvitedMemberRightsGuard)
		if (rights.includes(Rights.delete_member))
			guards.push(DeleteMemberRightsGuard)
		if (rights.includes(Rights.delete_project))
			guards.push(DeleteProjectRightsGuard)
		if (rights.includes(Rights.delete_role)) guards.push(DeleteRoleRightsGuard)
		if (rights.includes(Rights.delete_task)) guards.push(DeleteTaskRightsGuard)
		if (rights.includes(Rights.delete_team)) guards.push(DeleteTeamRightsGuard)
		if (rights.includes(Rights.edit_project))
			guards.push(EditProjectRightsGuard)
		if (rights.includes(Rights.edit_role)) guards.push(EditRoleRightsGuard)
		if (rights.includes(Rights.edit_task)) guards.push(EditTaskRightsGuard)
		if (rights.includes(Rights.edit_team)) guards.push(EditTeamRightsGuard)
		if (rights.includes(Rights.invite_member))
			guards.push(InviteMemberRightsGuard)
		if (rights.includes(Rights.set_member_project))
			guards.push(SetMemberProjectRightsGuard)
		if (rights.includes(Rights.set_member_role))
			guards.push(SetMemberRoleRightsGuard)
		if (rights.includes(Rights.set_task_executor))
			guards.push(SetTaskExecutorRightsGuard)

		return applyDecorators(UseGuards(JwtAuthGuard, MemberGuard, ...guards))
	} else {
		return applyDecorators(UseGuards(JwtAuthGuard, MemberGuard))
	}
}
