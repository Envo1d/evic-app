import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { AddProjectMemberDto } from './dto/add-member.dto'
import { CreateProjectDto } from './dto/create-project.dto'
import { FindProjectDto } from './dto/find-project.dto'
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
	addMember(@Body() dto: AddProjectMemberDto) {
		return this.projectService.addMember(dto)
	}

	@Auth()
	@Get('by-team')
	getAllByTeam(@Body() dto: FindProjectDto, @CurrentUser('id') userId: string) {
		return this.projectService.getAllByTeamId(dto, userId)
	}

	@Auth()
	@Get('details')
	getProjectDetails(
		@Body() dto: FindProjectDto,
		@CurrentUser('id') userId: string
	) {
		return this.projectService.getDetails(dto, userId)
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
	@Delete(':id')
	remove(@Param('id') id: string, @Body() dto: RemoveProjectDto) {
		return this.projectService.remove(id, dto)
	}
}
