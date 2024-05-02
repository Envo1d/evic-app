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
import { AddMemberDto } from './dto/add-member.dto'
import { CreateTeamRoleDto } from './dto/create-team-role.dto'
import { CreateTeamDto } from './dto/create-team.dto'
import { RemoveMemberDto } from './dto/remove-member.dto'
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
	async createRole(@Body() dto: CreateTeamRoleDto) {
		return this.teamService.createRole(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('add-member')
	@Auth()
	async addMember(@Body() dto: AddMemberDto) {
		return this.teamService.addMember(dto)
	}

	@Get('team-roles/:id')
	@Auth()
	async getTeamRoles(
		@CurrentUser('id') userId: string,
		@Param('id') teamId: string
	) {
		return this.teamService.getTeamRoles(teamId, userId)
	}

	@HttpCode(200)
	@Delete('remove-member/:team-id')
	@Auth()
	async removeMember(
		@Param('team-id') teamId: string,
		@Body() dto: RemoveMemberDto
	) {
		return this.teamService.removeMember(teamId, dto)
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
