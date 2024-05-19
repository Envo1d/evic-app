import {
	Body,
	Controller,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthTeamMember } from '../team/decorators/auth-team-member.decorator'
import { CurrentTeam } from '../team/decorators/team.decorator'
import { CreateTaskDto } from './dto/create-task.dto'
import { DeleteTaskDto } from './dto/delete-task.dto'
import { UpdateDescriptionDto } from './dto/update-description.dto'
import { UpdateNameDto } from './dto/update-name.dto'
import { UpdateOrderDto } from './dto/update-order'
import { TaskService } from './task.service'

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(':projectId')
	@AuthTeamMember(['create_task'])
	async create(
		@Body() dto: CreateTaskDto,
		@Param('projectId') projectId: string,
		@CurrentTeam() teamId: string
	) {
		return this.taskService.create(projectId, teamId, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('update-name/:projectId')
	@AuthTeamMember(['edit_task'])
	async updateName(
		@Body() dto: UpdateNameDto,
		@Param('projectId') projectId: string,
		@CurrentTeam() teamId: string
	) {
		return this.taskService.updateName(projectId, teamId, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('update-description/:projectId')
	@AuthTeamMember(['edit_task'])
	async updateDescription(
		@Body() dto: UpdateDescriptionDto,
		@Param('projectId') projectId: string,
		@CurrentTeam() teamId: string
	) {
		return this.taskService.updateDescription(projectId, teamId, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('update-order-list/:projectId')
	@AuthTeamMember(['edit_task'])
	async updateOrderOnList(
		@Body() dto: UpdateOrderDto,
		@Param('projectId') projectId: string,
		@CurrentTeam() teamId: string
	) {
		return this.taskService.updateOrderOnList(projectId, teamId, dto)
	}

	@HttpCode(200)
	@Put(':projectId')
	@AuthTeamMember(['delete_task'])
	async delete(
		@Param('projectId') projectId: string,
		@CurrentTeam() teamId: string,
		@Body() dto: DeleteTaskDto
	) {
		return this.taskService.delete(projectId, teamId, dto)
	}
}
