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
import { CreateListDto } from './dto/create-list.dto'
import { CreateProjectDto } from './dto/create-project.dto'
import { DeleteListDto } from './dto/delete-list.dto'
import { RemoveProjectMemberDto } from './dto/remove-member.dto'

import { CopyListDto } from './dto/copy-list.dto'
import { UpdateListOrderDto } from './dto/update-list-order.dto'
import { UpdateListTitleDto } from './dto/update-list-title.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ProjectService } from './project.service'

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	@HttpCode(200)
	@AuthTeamMember(['create_project'])
	@UsePipes(new ValidationPipe())
	create(@Body() dto: CreateProjectDto, @CurrentTeam() teamId: string) {
		return this.projectService.create(dto, teamId)
	}

	@Post('add-member')
	@HttpCode(200)
	@AuthTeamMember(['invite_member'])
	@UsePipes(new ValidationPipe())
	addMember(@Body() dto: AddProjectMemberDto, @CurrentTeam() teamId: string) {
		return this.projectService.addMember(dto, teamId)
	}

	@Put('delete-member')
	@HttpCode(200)
	@AuthTeamMember(['delete_member'])
	@UsePipes(new ValidationPipe())
	deleteMember(
		@Body() dto: RemoveProjectMemberDto,
		@CurrentTeam() teamId: string
	) {
		return this.projectService.deleteMember(dto, teamId)
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
	update(
		@Param('id') id: string,
		@Body() dto: UpdateProjectDto,
		@CurrentTeam() teamId: string
	) {
		return this.projectService.update(id, dto, teamId)
	}

	@HttpCode(200)
	@AuthTeamMember(['delete_project'])
	@UsePipes(new ValidationPipe())
	@Put('delete/:id')
	remove(@Param('id') id: string, @CurrentTeam() teamId: string) {
		return this.projectService.remove(id, teamId)
	}

	@Post(':id')
	@HttpCode(200)
	@AuthTeamMember(['create_task'])
	@UsePipes(new ValidationPipe())
	createList(
		@Body() dto: CreateListDto,
		@Param('id') projectId: string,
		@CurrentTeam() teamId: string
	) {
		return this.projectService.createList(projectId, dto, teamId)
	}

	@Post('/copy-list/:id')
	@HttpCode(200)
	@AuthTeamMember(['create_task'])
	@UsePipes(new ValidationPipe())
	copyList(
		@Body() dto: CopyListDto,
		@Param('id') projectId: string,
		@CurrentTeam() teamId: string
	) {
		return this.projectService.copyList(projectId, dto, teamId)
	}

	@Patch('/list-title/:projectId')
	@HttpCode(200)
	@AuthTeamMember(['edit_task'])
	@UsePipes(new ValidationPipe())
	updateListTitle(
		@Body() dto: UpdateListTitleDto,
		@Param('id') projectId: string,
		@CurrentTeam() teamId: string
	) {
		return this.projectService.updateListTitle(projectId, dto, teamId)
	}

	@Patch('/list-order/:projectId')
	@HttpCode(200)
	@AuthTeamMember(['edit_task'])
	@UsePipes(new ValidationPipe())
	updateListOrder(
		@Body() dto: UpdateListOrderDto,
		@Param('id') projectId: string,
		@CurrentTeam() teamId: string
	) {
		return this.projectService.updateListOrder(projectId, dto, teamId)
	}

	@Put('/delete-list/:projectId')
	@HttpCode(200)
	@AuthTeamMember(['delete_task'])
	@UsePipes(new ValidationPipe())
	deleteList(
		@Body() dto: DeleteListDto,
		@Param('id') projectId: string,
		@CurrentTeam() teamId: string
	) {
		return this.projectService.deleteList(projectId, dto, teamId)
	}
}
