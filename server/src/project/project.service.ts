import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddProjectMemberDto } from './dto/add-member.dto'
import { CreateProjectDto } from './dto/create-project.dto'
import { RemoveProjectMemberDto } from './dto/remove-member.dto'
import { RemoveProjectDto } from './dto/remove-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

@Injectable()
export class ProjectService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateProjectDto, userId: string) {
		const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
			dto.imagePath.split('|')
		if (
			!imageId ||
			!imageThumbUrl ||
			!imageFullUrl ||
			!imageLinkHTML ||
			!imageUserName
		)
			throw new BadRequestException('Missing fields. Failed to create project.')
		return await this.prisma.project.create({
			data: {
				name: dto.name,
				imageId,
				imageFullUrl,
				imageLinkHTML,
				imageThumbUrl,
				imageUserName,
				team: {
					connect: {
						id: dto.teamId
					}
				},
				owner: {
					connect: {
						id: dto.teamMemberId
					}
				},
				members: {
					create: [
						{
							teamMemberId: dto.teamMemberId
						}
					]
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

	async deleteMember(dto: RemoveProjectMemberDto, userId: string) {
		return await this.prisma.projectMember.delete({
			where: {
				id: dto.projectMemberId,
				projectId: dto.projectId,
				teamMemberId: dto.teamMemberId
			}
		})
	}

	async getAllByTeamId(teamId: string, userId: string) {
		return await this.prisma.project.findMany({
			where: {
				teamId: teamId
			},
			include: {
				members: {
					select: {
						id: true
					}
				},
				tasks: {
					select: {
						id: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	async getDetails(projectId: string, userId: string) {
		return await this.prisma.project.findUnique({
			where: {
				id: projectId
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
