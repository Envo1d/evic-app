import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { TeamService } from '../team/team.service'
import { AddProjectMemberDto } from './dto/add-member.dto'
import { CreateProjectDto } from './dto/create-project.dto'
import { FindProjectDto } from './dto/find-project.dto'
import { RemoveProjectDto } from './dto/remove-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

@Injectable()
export class ProjectService {
	constructor(
		private prisma: PrismaService,
		private teamService: TeamService
	) {}

	async create(dto: CreateProjectDto, userId: string) {
		return await this.prisma.project.create({
			data: {
				name: dto.name,
				imagePath: dto.imagePath,
				team: {
					connect: {
						id: dto.teamId
					}
				},
				owner: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async update(id: string, dto: UpdateProjectDto) {
		return await this.prisma.project.update({
			where: {
				id,
				teamId: dto.teamId
			},
			data: {
				name: dto.name,
				imagePath: dto.imagePath
			}
		})
	}

	async remove(id: string, dto: RemoveProjectDto) {
		return await this.prisma.project.delete({
			where: {
				id,
				teamId: dto.teamId
			}
		})
	}

	async addMember(dto: AddProjectMemberDto) {
		return await this.prisma.projectMember.create({
			data: {
				project: {
					connect: {
						id: dto.projectId
					}
				},
				teamMember: {
					connect: {
						id: dto.teamMemberId
					}
				}
			}
		})
	}

	async getAllByTeamId(dto: FindProjectDto, userId: string) {
		if (this.teamService.isCreatorOrMember(dto.teamId, userId))
			return await this.prisma.project.findMany({
				where: {
					id: dto.projectId,
					teamId: dto.teamId
				},

				include: {
					_count: {
						select: { tasks: true }
					}
				}
			})
	}

	async getDetails(dto: FindProjectDto, userId: string) {
		if (this.teamService.isCreatorOrMember(dto.teamId, userId))
			return await this.prisma.project.findUnique({
				where: {
					id: dto.projectId,
					teamId: dto.teamId
				},
				include: {
					members: {
						include: {
							teamMember: {
								include: {
									user: {
										select: {
											email: true,
											nickname: true,
											firstName: true,
											lastName: true,
											avatarPath: true
										}
									}
								}
							}
						}
					},
					tasks: {
						include: {
							comments: {
								include: {
									user: {
										select: {
											email: true,
											nickname: true,
											firstName: true,
											lastName: true,
											avatarPath: true
										}
									}
								}
							},
							taskExecutor: {
								select: {
									email: true,
									nickname: true,
									firstName: true,
									lastName: true,
									avatarPath: true
								}
							}
						}
					}
				}
			})
	}
}
