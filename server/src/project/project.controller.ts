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
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
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
	@Auth()
	@UsePipes(new ValidationPipe())
	create(@Body() dto: CreateProjectDto, @CurrentUser('id') userId: string) {
		return this.projectService.create(dto, userId)
	}

	@Post('add-member')
	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	addMember(
		@Body() dto: AddProjectMemberDto,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.addMember(dto, userId)
	}

	@Put('delete-member')
	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	deleteMember(
		@Body() dto: RemoveProjectMemberDto,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.deleteMember(dto, userId)
	}

	@Auth()
	@Get('by-team/:id')
	getAllByTeam(
		@Param('id') projectId: string,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.getAllByTeamId(projectId, userId)
	}

	@Auth()
	@Get('details/:id')
	getProjectDetails(
		@Param('id') projectId: string,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.getDetails(projectId, userId)
	}

	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
		return this.projectService.update(id, dto)
	}

	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	@Put('delete/:id')
	remove(@Param('id') id: string, @Body() dto: RemoveProjectDto) {
		return this.projectService.remove(id, dto)
	}
}
