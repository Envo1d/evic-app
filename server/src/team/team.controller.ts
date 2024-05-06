import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { AddMemberDto, DeleteInvitedMemberDto } from './dto/add-member.dto'
import { CreateTeamRoleDto } from './dto/create-team-role.dto'
import { CreateTeamDto } from './dto/create-team.dto'
import { RemoveMemberDto } from './dto/remove-member.dto'
import {
	SetMemberRoleDto,
	UpdateMemberRoleDto
} from './dto/update-member-role.dto'
import { UpdateTeamDto } from './dto/update-team.dto'
import { TeamService } from './team.service'

@Controller('team')
export class TeamController {
	constructor(private readonly teamService: TeamService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('create')
	@Auth()
	async create(@Body() dto: CreateTeamDto, @CurrentUser('id') userId: string) {
		return this.teamService.create(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('create-role')
	@Auth()
	async createRole(
		@Body() dto: CreateTeamRoleDto,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.createRole(dto, userId)
	}

	@Get('team-roles/:id')
	@Auth()
	async getTeamRoles(
		@CurrentUser('id') userId: string,
		@Param('id') teamId: string
	) {
		return this.teamService.getTeamRoles(teamId, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('set-role')
	@Auth()
	async setMemberRole(
		@Body() dto: SetMemberRoleDto,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.setMemberRole(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('update-role')
	@Auth()
	async updateMemberRole(
		@Body() dto: UpdateMemberRoleDto,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.updateMemberRole(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('invite-member')
	@Auth()
	async inviteMember(
		@Body() dto: AddMemberDto,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.inviteMember(userId, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete('delete-invite')
	@Auth()
	async deleteInvite(
		@Body() dto: DeleteInvitedMemberDto,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.deleteInvitedMember(userId, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('accept-invite/:id')
	@Auth()
	async acceptInvite(
		@Param('id') inviteId: string,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.acceptInvite(inviteId, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Delete('decline-invite/:id')
	@Auth()
	async declineInvite(
		@Param('id') inviteId: string,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.declineInvite(inviteId, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get('invitations/:teamId')
	@Auth()
	async getTeamInvitations(
		@CurrentUser('id') userId: string,
		@Param('teamId') teamId: string
	) {
		return this.teamService.getTeamInvitations(teamId, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get('user-invitations')
	@Auth()
	async getUserInvitations(@CurrentUser('id') userId: string) {
		return this.teamService.getUserInvitations(userId)
	}

	@HttpCode(200)
	@Delete('remove-member/:id')
	@Auth()
	async removeMember(
		@Param('id') teamId: string,
		@Body() dto: RemoveMemberDto,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.removeMember(teamId, dto, userId)
	}

	@HttpCode(200)
	@Delete('leave-team/:id')
	@Auth()
	async leaveTeam(
		@Param('id') teamId: string,
		@Body() dto: RemoveMemberDto,
		@CurrentUser('id') userId: string
	) {
		return this.teamService.removeMember(teamId, dto, userId)
	}

	@Get('user-teams')
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.teamService.findAllUserTeams(userId)
	}

	@Get(':id')
	@Auth()
	async getTeam(@CurrentUser('id') userId: string, @Param('id') id: string) {
		return this.teamService.getTeamDetails(id, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(
		@Body() dto: UpdateTeamDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.teamService.updateTeamName(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async remove(@Param('id') id: string) {
		return this.teamService.removeTeam(id)
	}
}
