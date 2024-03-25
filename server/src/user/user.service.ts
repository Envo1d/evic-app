import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { startOfDay, subDays } from 'date-fns'
import { Status } from 'prisma/generated/client'
import { RegisterDto } from '../auth/dto/register.dto'
import { PrismaService } from '../prisma/prisma.service'
import { UserDto } from './dto/user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async create(dto: RegisterDto) {
		const passwordHash = await hash(dto.password)

		return await this.prisma.user.create({
			data: {
				firstName: dto.firstName,
				lastName: dto.lastName,
				email: dto.email,
				password: passwordHash
			}
		})
	}

	async getByIdForJwt(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				id: true
			}
		})
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			}
		})
	}

	async isExist(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			},
			select: {
				id: true
			}
		})
	}

	async update(id: string, dto: UserDto) {
		let data = dto

		if (data.password) data = { ...data, password: await hash(dto.password) }

		return await this.prisma.user.update({
			where: {
				id
			},
			data,
			select: {
				firstName: true,
				lastName: true,
				nickname: true,
				email: true,
				workInterval: true,
				breakInterval: true,
				intervalsCount: true
			}
		})
	}

	async getProfile(id: string) {
		const profile = await this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				tasks: true
			}
		})

		const totalTasks = profile.tasks.length
		// TODO: change to task service
		const completedTasks = await this.prisma.task.count({
			where: {
				userId: id,
				status: Status.completed
			}
		})

		const todayStart = startOfDay(new Date())
		const weekStart = startOfDay(subDays(new Date(), 7))

		const todayTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: todayStart.toISOString()
				}
			}
		})

		const weekTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: weekStart.toISOString()
				}
			}
		})

		const { password, ...rest } = profile

		return {
			user: rest,
			statistics: [
				{ label: 'Total', value: totalTasks },
				{ label: 'Completed tasks', value: completedTasks },
				{ label: 'Today tasks', value: todayTasks },
				{ label: 'Week tasks', value: weekTasks }
			]
		}
	}
}
