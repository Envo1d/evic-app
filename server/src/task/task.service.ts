import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TaskDto } from './dto/task.dto'

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: string) {
		// return this.prisma.projectMember.findMany({
		// 	where: {
		// 		id: userId
		// 	},
		// 	select: {
		// 		taskExecutions: {
		// 			include: {
		// 				project: {
		// 					include: {
		// 						team: {
		// 							select: {
		// 								name: true,
		// 								id: true
		// 							}
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// })
	}

	async create(dto: TaskDto, userId: string) {
		// const { deadline, projectId, ...rest } = dto
		// return this.prisma.task.create({
		// 	data: {
		// 		...rest,
		// 		deadline: new Date(deadline),
		// 		taskExecutor: {
		// 			connect: {
		// 				id: userId
		// 			}
		// 		},
		// 		project: {
		// 			connect: {
		// 				id: projectId
		// 			}
		// 		}
		// 	},
		// 	include: {
		// 		taskExecutor: {
		// 			select: {
		// 				id: true
		// 			}
		// 		}
		// 	}
		// })
	}

	async update(dto: Partial<TaskDto>, taskId: string) {
		return this.prisma.task.update({
			where: {
				id: taskId
			},
			data: dto
		})
	}

	async delete(taskId: string) {
		return this.prisma.task.delete({
			where: {
				id: taskId
			}
		})
	}
}
