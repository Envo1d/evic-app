import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from '../auth/dto/auth.dto'
import { PrismaService } from '../prisma/prisma.service'
import { UserDto } from './dto/user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async create(dto: AuthDto) {
		const passwordHash = await hash(dto.password)

		return await this.prisma.user.create({
			data: {
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
			}
		})

		const { password, ...rest } = profile

		return {
			...rest
		}
	}
}
