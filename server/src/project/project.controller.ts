import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthTeamMember } from 'src/team/decorators/auth-team-member.decorator'
import { CurrentTeam } from '../team/decorators/team.decorator'
import { AddProjectMemberDto } from './dto/add-member.dto'
import { CreateProjectDto } from './dto/create-project.dto'
import { RemoveProjectMemberDto } from './dto/remove-member.dto'
import { RemoveProjectDto } from './dto/remove-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ProjectService } from './project.service'

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	@HttpCode(200)
	@AuthTeamMember(['create_project'])
	@UsePipes(new ValidationPipe())
	create(@Body() dto: CreateProjectDto) {
		return this.projectService.create(dto)
	}

	@Post('add-member')
	@HttpCode(200)
	@AuthTeamMember(['invite_member'])
	@UsePipes(new ValidationPipe())
	addMember(@Body() dto: AddProjectMemberDto) {
		return this.projectService.addMember(dto)
	}

	@Put('delete-member')
	@HttpCode(200)
	@AuthTeamMember(['delete_member'])
	@UsePipes(new ValidationPipe())
	deleteMember(@Body() dto: RemoveProjectMemberDto) {
		return this.projectService.deleteMember(dto)
	}

	@AuthTeamMember()
	@Get('by-team')
	getAllByTeam(@CurrentTeam() teamId: string) {
		return this.projectService.getAllByTeamId(teamId)
	}

	@AuthTeamMember()
	@Get('details/:id')
	getProjectDetails(
		@Param('id') projectId: string,
		@CurrentTeam() teamId: string
	) {
		return this.projectService.getDetails(projectId, teamId)
	}

	@HttpCode(200)
	@AuthTeamMember(['edit_project'])
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
		return this.projectService.update(id, dto)
	}

	@HttpCode(200)
	@AuthTeamMember(['delete_project'])
	@UsePipes(new ValidationPipe())
	@Put('delete/:id')
	remove(@Param('id') id: string, @Body() dto: RemoveProjectDto) {
		return this.projectService.remove(id, dto)
	}
}
