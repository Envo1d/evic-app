import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { DeleteTaskDto } from './dto/delete-task.dto'
import { UpdateDescriptionDto } from './dto/update-description.dto'
import { UpdateNameDto } from './dto/update-name.dto'
import { UpdateOrderDto } from './dto/update-order'

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}

	async create(projectId: string, teamId: string, dto: CreateTaskDto) {
		try {
			const lastTask = await this.prisma.task.findFirst({
				where: {
					list: {
						id: dto.listId,
						project: {
							id: projectId,
							teamId
						}
					}
				},
				orderBy: { order: 'desc' },
				select: { order: true }
			})

			const newOrder = lastTask ? lastTask.order + 1 : 1

			return await this.prisma.task.create({
				data: {
					name: dto.name,
					order: newOrder,
					list: {
						connect: {
							id: dto.listId
						}
					}
				}
			})
		} catch (error) {
			throw new BadRequestException('List not found')
		}
	}

	async updateName(projectId: string, teamId: string, dto: UpdateNameDto) {
		try {
			return this.prisma.task.update({
				where: {
					id: dto.taskId,
					list: {
						id: dto.listId,
						project: {
							id: projectId,
							teamId
						}
					}
				},
				data: {
					name: dto.name
				}
			})
		} catch (error) {
			throw new BadRequestException('Task not found')
		}
	}

	async updateDescription(
		projectId: string,
		teamId: string,
		dto: UpdateDescriptionDto
	) {
		try {
			return this.prisma.task.update({
				where: {
					id: dto.taskId,
					list: {
						id: dto.listId,
						project: {
							id: projectId,
							teamId
						}
					}
				},
				data: {
					description: dto.description
				}
			})
		} catch (error) {
			throw new BadRequestException('Task not found')
		}
	}

	async updateOrderOnList(
		projectId: string,
		teamId: string,
		dto: UpdateOrderDto
	) {
		try {
			return await this.prisma.$transaction(
				dto.tasks.map(task =>
					this.prisma.task.update({
						where: {
							id: task.id,
							list: {
								project: {
									id: projectId,
									teamId
								}
							}
						},
						data: { order: task.order, listId: task.listId }
					})
				)
			)
		} catch (error) {
			throw new BadRequestException('Task not found')
		}
	}

	async delete(projectId: string, teamId: string, dto: DeleteTaskDto) {
		try {
			return this.prisma.task.delete({
				where: {
					id: dto.taskId,
					list: {
						id: dto.listId,
						project: {
							id: projectId,
							teamId
						}
					}
				}
			})
		} catch (error) {
			throw new BadRequestException('Task not found')
		}
	}
}
