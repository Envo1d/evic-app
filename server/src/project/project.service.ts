import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddProjectMemberDto } from './dto/add-member.dto'
import { CopyListDto } from './dto/copy-list.dto'
import { CreateListDto } from './dto/create-list.dto'
import { CreateProjectDto } from './dto/create-project.dto'
import { DeleteListDto } from './dto/delete-list.dto'
import { RemoveProjectMemberDto } from './dto/remove-member.dto'
import { UpdateListOrderDto } from './dto/update-list-order.dto'
import { UpdateListTitleDto } from './dto/update-list-title.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

@Injectable()
export class ProjectService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateProjectDto, teamId: string) {
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
						id: teamId
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

	async update(id: string, dto: UpdateProjectDto, teamId: string) {
		return await this.prisma.project.update({
			where: {
				id,
				teamId: teamId
			},
			data: {
				name: dto.name
			}
		})
	}

	async remove(id: string, teamId: string) {
		return await this.prisma.project.delete({
			where: {
				id,
				teamId: teamId
			}
		})
	}

	async addMember(dto: AddProjectMemberDto, teamId: string) {
		const project = await this.checkProject(dto.projectId, teamId)

		return await this.prisma.projectMember.create({
			data: {
				project: {
					connect: {
						id: project.id
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

	async deleteMember(dto: RemoveProjectMemberDto, teamId: string) {
		const project = await this.checkProject(dto.projectId, teamId)

		return await this.prisma.projectMember.delete({
			where: {
				id: dto.projectMemberId,
				projectId: project.id,
				teamMemberId: dto.teamMemberId
			}
		})
	}

	async getAllByTeamId(teamId: string) {
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
				lists: {
					include: {
						tasks: {
							select: {
								id: true
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

	async getDetails(projectId: string, teamId: string) {
		return await this.prisma.project.findUnique({
			where: {
				id: projectId,
				teamId
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
				lists: {
					include: {
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
							},
							orderBy: {
								order: 'asc'
							}
						}
					},
					orderBy: {
						order: 'asc'
					}
				}
			}
		})
	}

	async createList(projectId: string, dto: CreateListDto, teamId: string) {
		const project = await this.checkProject(projectId, teamId)

		const lastList = await this.prisma.list.findFirst({
			where: { projectId: project.id },
			orderBy: { order: 'desc' },
			select: { order: true }
		})

		const newOrder = lastList ? lastList.order + 1 : 1

		return await this.prisma.list.create({
			data: {
				title: dto.title,
				order: newOrder,
				project: {
					connect: {
						id: project.id
					}
				}
			}
		})
	}

	async copyList(projectId: string, dto: CopyListDto, teamId: string) {
		const project = await this.checkProject(projectId, teamId)

		const listToCopy = await this.prisma.list.findUnique({
			where: {
				id: dto.listId,
				projectId: project.id,
				project: {
					teamId
				}
			},
			include: {
				tasks: true
			}
		})

		if (!listToCopy) throw new BadRequestException('List not found!')

		const lastList = await this.prisma.list.findFirst({
			where: { projectId, project: { teamId } },
			orderBy: { order: 'desc' },
			select: { order: true }
		})

		const newOrder = lastList ? lastList.order + 1 : 1
		const newTitle = `${listToCopy.title} - Copy`
		return await this.prisma.list.create({
			data: {
				project: {
					connect: {
						id: project.id
					}
				},
				title: newTitle,
				order: newOrder,
				tasks: {
					createMany: {
						data: listToCopy.tasks.map(task => ({
							name: task.name,
							description: task.description,
							order: task.order,
							priority: task.priority,
							status: task.status,
							imagePath: task.imagePath,
							deadline: task.deadline,
							color: task.color,
							creatorId: task.creatorId,
							taskExecutorId: task.taskExecutorId
						}))
					}
				}
			},
			include: {
				tasks: true
			}
		})
	}

	async updateListTitle(
		projectId: string,
		dto: UpdateListTitleDto,
		teamId: string
	) {
		const project = await this.checkProject(projectId, teamId)

		return await this.prisma.list.update({
			where: {
				projectId: project.id,
				id: dto.listId
			},
			data: {
				title: dto.title
			}
		})
	}

	async updateListOrder(
		projectId: string,
		dto: UpdateListOrderDto,
		teamId: string
	) {
		const project = await this.checkProject(projectId, teamId)

		return await this.prisma.list.update({
			where: {
				projectId: project.id,
				id: dto.listId
			},
			data: {
				order: dto.order
			}
		})
	}

	async deleteList(projectId: string, dto: DeleteListDto, teamId: string) {
		const project = await this.checkProject(projectId, teamId)

		return await this.prisma.list.delete({
			where: {
				projectId: project.id,
				id: dto.listId
			}
		})
	}

	async checkProject(projectId: string, teamId: string) {
		const project = await this.prisma.project.findFirst({
			where: {
				id: projectId,
				teamId
			},
			select: {
				id: true
			}
		})

		if (!project) throw new BadRequestException('Project not found')

		return project
	}

	async checkList(listId, projectId, teamId) {
		const project = await this.checkProject(projectId, teamId)

		const list = await this.prisma.list.findFirst({
			where: {
				id: listId,
				projectId: project.id
			},
			select: {
				id: true
			}
		})

		if (!list) throw new BadRequestException('Project not found')

		return list
	}
}
