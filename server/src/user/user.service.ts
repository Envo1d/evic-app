import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { RegisterDto } from '../auth/dto/register.dto'
import { PrismaService } from '../prisma/prisma.service'

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
}
