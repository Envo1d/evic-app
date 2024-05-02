import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AddMemberDto } from './dto/add-member.dto'
import { CreateTeamRoleDto } from './dto/create-team-role.dto'
import { CreateTeamDto } from './dto/create-team.dto'
import { RemoveMemberDto } from './dto/remove-member.dto'
import { UpdateTeamDto } from './dto/update-team.dto'

@Injectable()
export class TeamService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateTeamDto, userId: string) {
		const team = await this.prisma.team.create({
			data: {
				name: dto.name,
				creator: {
					connect: {
						id: userId
					}
				},
				roles: {
					createMany: {
						data: [
							{
								name: 'Admin',
								rights: [
									'add_member',
									'create',
									'delete',
									'delete_member',
									'edit',
									'edit_member'
								]
							},
							{
								name: 'Member',
								rights: []
							}
						]
					}
				}
			}
		})
	}

	async createRole(dto: CreateTeamRoleDto) {
		return await this.prisma.teamRole.create({
			data: {
				name: dto.name,
				rights: dto.rights,
				team: {
					connect: {
						id: dto.teamId
					}
				}
			}
		})
	}

	async addMember({ teamId, userId, roleId }: AddMemberDto) {
		return await this.prisma.teamMember.create({
			data: {
				user: {
					connect: {
						id: userId
					}
				},
				team: {
					connect: {
						id: teamId
					}
				},
				role: {
					connect: {
						id: roleId
					}
				}
			}
		})
	}

	async removeMember(teamId: string, dto: RemoveMemberDto) {
		return await this.prisma.teamMember.delete({
			where: {
				id: dto.memberId,
				teamId,
				userId: dto.userId
			}
		})
	}

	async isCreatorOrMember(teamId: string, userId: string) {
		const isMember = await this.prisma.teamMember.findFirst({
			where: {
				userId,
				teamId
			}
		})

		const isCreator = await this.prisma.team.findFirst({
			where: {
				creatorId: userId
			},
			select: {
				creatorId: true
			}
		})

		if (isCreator || isMember) return true

		throw new BadRequestException('User is not member of this team')
	}

	async getTeamRoles(teamId: string, userId: string) {
		if ((await this.isCreatorOrMember(teamId, userId)) === true) {
			return await this.prisma.teamRole.findMany({
				where: {
					teamId
				}
			})
		}
	}

	async getTeamDetails(teamId: string, userId: string) {
		if ((await this.isCreatorOrMember(teamId, userId)) === true) {
			return await this.prisma.team.findUnique({
				where: {
					id: teamId
				},
				include: {
					members: {
						include: {
							role: {
								select: {
									name: true
								}
							},
							user: {
								select: {
									firstName: true,
									lastName: true,
									nickname: true,
									avatarPath: true,
									email: true
								}
							}
						}
					},
					projects: {
						include: {
							_count: {
								select: { tasks: true }
							}
						}
					}
				}
			})
		}
	}

	async findAllUserTeams(userId: string) {
		const createdByUser = await this.prisma.team.findMany({
			where: {
				creatorId: userId
			},
			select: {
				id: true,
				name: true
			}
		})

		const member = await this.prisma.teamMember.findMany({
			where: {
				userId
			},
			include: {
				team: {
					select: {
						id: true,
						name: true
					}
				},
				role: {
					select: {
						name: true
					}
				}
			}
		})
		return {
			createdByUser,
			member
		}
	}

	async updateTeamName(id: string, dto: UpdateTeamDto) {
		return await this.prisma.team.update({
			where: {
				id
			},
			data: {
				name: dto.name
			}
		})
	}

	async removeTeam(id: string) {
		return await this.prisma.team.delete({ where: { id } })
	}
}
