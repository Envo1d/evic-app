import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { TeamService } from '../team/team.service'
import { AddProjectMemberDto } from './dto/add-member.dto'
import { CreateProjectDto } from './dto/create-project.dto'
import { FindProjectDto } from './dto/find-project.dto'
import { RemoveProjectMemberDto } from './dto/remove-member.dto'
import { RemoveProjectDto } from './dto/remove-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

@Injectable()
export class ProjectService {
	constructor(
		private prisma: PrismaService,
		private teamService: TeamService
	) {}

	async create(dto: CreateProjectDto, userId: string) {
		if (await this.teamService.isCreatorOrMember(dto.teamId, userId))
			return await this.prisma.project.create({
				data: {
					name: dto.name,
					team: {
						connect: {
							id: dto.teamId
						}
					},
					owner: {
						connect: {
							id: dto.teamMemberId
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
				name: dto.name
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

	async addMember(dto: AddProjectMemberDto, userId: string) {
		if (await this.teamService.isCreatorOrMember(dto.teamId, userId))
			if (
				await this.teamService.isCreatorOrMember(
					dto.teamId,
					undefined,
					dto.teamMemberId
				)
			)
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

	async isCreatorOrMember(
		teamMemberId: string,
		projectId: string,
		memberId: string
	) {
		const isMember = await this.prisma.projectMember.findFirst({
			where: {
				teamMemberId,
				projectId,
				id: memberId
			}
		})

		const isCreator = await this.prisma.project.findFirst({
			where: {
				ownerId: teamMemberId
			},
			select: {
				ownerId: true
			}
		})

		if (isCreator) return { creator: true }
		if (isMember) return { member: true, memberData: isMember }

		throw new BadRequestException('User is not member of this project')
	}

	async deleteMember(dto: RemoveProjectMemberDto, userId: string) {
		if (await this.teamService.isCreatorOrMember(dto.teamId, userId))
			if (
				await this.isCreatorOrMember(
					dto.teamMemberId,
					dto.projectId,
					dto.projectMemberId
				)
			)
				return await this.prisma.projectMember.delete({
					where: {
						id: dto.projectMemberId,
						projectId: dto.projectId,
						teamMemberId: dto.teamMemberId
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
									teamMember: {
										select: {
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
							taskExecutor: {
								include: {
									projectMember: {
										include: {
											teamMember: {
												select: {
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
									}
								}
							}
						}
					}
				}
			})
	}
}
