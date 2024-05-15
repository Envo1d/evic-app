import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	Res,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Rights } from '@prisma/client'
import { Response } from 'express'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { AppConfig } from '../config/configuration.interface'
import { AuthTeamMember } from './decorators/auth-team-member.decorator'
import { CurrentTeam } from './decorators/team.decorator'
import { AddMemberDto, DeleteInvitedMemberDto } from './dto/add-member.dto'
import {
	CreateTeamRoleDto,
	UpdateTeamRoleDto
} from './dto/create-team-role.dto'
import { CreateTeamDto } from './dto/create-team.dto'
import { RemoveMemberDto } from './dto/remove-member.dto'
import { UpdateMemberRoleDto } from './dto/update-member-role.dto'
import { UpdateTeamDto } from './dto/update-team.dto'
import { TeamService } from './team.service'

@Controller('team')
export class TeamController {
	constructor(
		private readonly teamService: TeamService,
		private readonly config: ConfigService
	) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('create')
	@Auth()
	async create(
		@Body() dto: CreateTeamDto,
		@CurrentUser('id') userId: string,
		@Res({ passthrough: true }) res: Response
	) {
		const data = await this.teamService.create(dto, userId)
		res.cookie('team_id', data.id, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365,
			domain: this.config.get<AppConfig>('app').domain,
			secure: this.config.get<AppConfig>('app').secure,
			sameSite: this.config.get<AppConfig>('app').cookie_same_site
		})
		return data
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('create-role')
	@AuthTeamMember([Rights.create_role])
	async createRole(
		@Body() dto: CreateTeamRoleDto,
		@CurrentTeam() teamId: string
	) {
		return this.teamService.createRole(dto, teamId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('update-role/:id')
	@AuthTeamMember([Rights.edit_role])
	async updateRole(
		@Body() dto: UpdateTeamRoleDto,
		@CurrentTeam() teamId: string,
		@Param('id') roleId: string
	) {
		return this.teamService.updateRole(dto, teamId, roleId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete('delete-role/:id')
	@AuthTeamMember([Rights.delete_role])
	async deleteRole(@CurrentTeam() teamId: string, @Param('id') roleId: string) {
		return this.teamService.deleteRole(roleId, teamId)
	}

	@HttpCode(200)
	@Put('/set-active-team/:id')
	@Auth()
	async setActiveTeam(
		@Param('id') teamId: string,
		@CurrentUser('id') userId: string,
		@Res({ passthrough: true }) res: Response
	) {
		const data = await this.teamService.updateActiveTeamMember(teamId, userId)
		res.cookie('team_id', data.activeTeamId, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365,
			domain: this.config.get<AppConfig>('app').domain,
			secure: this.config.get<AppConfig>('app').secure,
			sameSite: this.config.get<AppConfig>('app').cookie_same_site
		})
		return data
	}

	@Get('/get-active-team')
	@Auth()
	async getActiveTeam(
		@CurrentUser('id') userId: string,
		@Res({ passthrough: true }) res: Response
	) {
		const data = await this.teamService.getActiveTeamMember(userId)
		res.cookie('team_id', data.activeTeamId, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365,
			domain: this.config.get<AppConfig>('app').domain,
			secure: this.config.get<AppConfig>('app').secure,
			sameSite: this.config.get<AppConfig>('app').cookie_same_site
		})
		return data
	}

	@Get('roles')
	@AuthTeamMember()
	async getTeamRoles(@CurrentTeam() teamId: string) {
		return this.teamService.getTeamRoles(teamId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('update-member-role')
	@AuthTeamMember([Rights.set_member_role])
	async updateMemberRole(
		@Body() dto: UpdateMemberRoleDto,
		@CurrentTeam() teamId: string
	) {
		return this.teamService.updateMemberRole(dto, teamId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('invite-member')
	@AuthTeamMember([Rights.invite_member])
	async inviteMember(@Body() dto: AddMemberDto, @CurrentTeam() teamId: string) {
		return this.teamService.inviteMember(dto, teamId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('delete-invite')
	@AuthTeamMember([Rights.delete_member])
	async deleteInvite(
		@Body() dto: DeleteInvitedMemberDto,
		@CurrentTeam() teamId: string
	) {
		return this.teamService.deleteInvitedMember(dto, teamId)
	}

	@HttpCode(200)
	@Put('accept-invite/:id')
	@Auth()
	async acceptInvite(
		@Param('id') inviteId: string,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.acceptInvite(inviteId, userId)
	}

	@HttpCode(200)
	@Delete('decline-invite/:id')
	@Auth()
	async declineInvite(
		@Param('id') inviteId: string,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.declineInvite(inviteId, userId)
	}

	@HttpCode(200)
	@Get('invitations')
	@AuthTeamMember()
	async getTeamInvitations(@CurrentTeam() teamId: string) {
		return this.teamService.getTeamInvitations(teamId)
	}

	@HttpCode(200)
	@Get('user-invitations')
	@Auth()
	async getUserInvitations(@CurrentUser('id') userId: string) {
		return this.teamService.getUserInvitations(userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('remove-member')
	@AuthTeamMember([Rights.delete_member])
	async removeMember(
		@CurrentTeam() teamId: string,
		@Body() dto: RemoveMemberDto
	) {
		return this.teamService.removeMember(teamId, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('leave-team')
	@AuthTeamMember()
	async leaveTeam(@CurrentTeam() teamId: string, @Body() dto: RemoveMemberDto) {
		return this.teamService.removeMember(teamId, dto)
	}

	@Get('user-teams')
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.teamService.findAllUserTeams(userId)
	}

	@Get()
	@AuthTeamMember()
	async getTeam(@CurrentTeam() teamId: string) {
		return this.teamService.getTeamDetails(teamId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put()
	@AuthTeamMember([Rights.edit_team])
	async update(@Body() dto: UpdateTeamDto, @CurrentTeam() teamId: string) {
		return this.teamService.updateTeamName(teamId, dto)
	}

	@HttpCode(200)
	@Delete()
	@AuthTeamMember([Rights.delete_team])
	async remove(@CurrentTeam() teamId: string) {
		return this.teamService.removeTeam(teamId)
	}
}
