import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddProjectMemberDto } from './dto/add-member.dto'
import { CopyListDto } from './dto/copy-list.dto'
import { CreateListDto } from './dto/create-list.dto'
import { CreateProjectDto } from './dto/create-project.dto'
import { DeleteListDto } from './dto/delete-list.dto'
import { RemoveProjectMemberDto } from './dto/remove-member.dto'
import { UpdateListTitleDto } from './dto/update-list-title.dto'
import { UpdateListsOrderDto } from './dto/update-lists-order.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

@Injectable()
export class ProjectService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateProjectDto, teamId: string, teamMemberId: string) {
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
		try {
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
							id: teamMemberId
						}
					},
					members: {
						create: [
							{
								teamMemberId: teamMemberId
							}
						]
					}
				}
			})
		} catch (error) {
			throw new BadRequestException('Creation error')
		}
	}

	async update(id: string, dto: UpdateProjectDto, teamId: string) {
		try {
			return await this.prisma.project.update({
				where: {
					id,
					teamId
				},
				data: {
					name: dto.name
				}
			})
		} catch (error) {
			throw new BadRequestException('Project not found')
		}
	}

	async remove(id: string, teamId: string) {
		try {
			return await this.prisma.project.delete({
				where: {
					id,
					teamId: teamId
				}
			})
		} catch (error) {
			throw new BadRequestException('Project not found')
		}
	}

	async addMember(dto: AddProjectMemberDto, teamId: string) {
		try {
			return await this.prisma.projectMember.create({
				data: {
					project: {
						connect: {
							id: dto.projectId,
							teamId
						}
					},
					teamMember: {
						connect: {
							id: dto.teamMemberId
						}
					}
				}
			})
		} catch (error) {
			throw new BadRequestException('Project not found')
		}
	}

	async deleteMember(dto: RemoveProjectMemberDto, teamId: string) {
		try {
			return await this.prisma.projectMember.delete({
				where: {
					id: dto.projectMemberId,
					project: {
						id: dto.projectId,
						teamId
					},
					teamMemberId: dto.teamMemberId
				}
			})
		} catch (error) {
			throw new BadRequestException('Member not found')
		}
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
		try {
			const lastList = await this.prisma.list.findFirst({
				where: {
					project: {
						id: projectId,
						teamId
					}
				},
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
							id: projectId
						}
					}
				}
			})
		} catch (error) {
			throw new BadRequestException('Creation error')
		}
	}

	async copyList(projectId: string, dto: CopyListDto, teamId: string) {
		try {
			const listToCopy = await this.prisma.list.findUnique({
				where: {
					id: dto.listId,
					project: {
						id: projectId,
						teamId
					}
				},
				include: {
					tasks: true
				}
			})

			if (!listToCopy) throw new BadRequestException('List not found!')

			const lastList = await this.prisma.list.findFirst({
				where: {
					project: {
						id: projectId,
						teamId
					}
				},
				orderBy: { order: 'desc' },
				select: { order: true }
			})

			const newOrder = lastList ? lastList.order + 1 : 1
			const newTitle = `${listToCopy.title} - Copy`
			return await this.prisma.list.create({
				data: {
					project: {
						connect: {
							id: projectId
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
								taskExecutorId: task.taskExecutorId
							}))
						}
					}
				},
				include: {
					tasks: true
				}
			})
		} catch (error) {
			throw new BadRequestException('List not found')
		}
	}

	async updateListTitle(
		projectId: string,
		dto: UpdateListTitleDto,
		teamId: string
	) {
		try {
			return await this.prisma.list.update({
				where: {
					id: dto.listId,
					project: {
						id: projectId,
						teamId
					}
				},
				data: {
					title: dto.title
				}
			})
		} catch (error) {
			throw new BadRequestException('List not found')
		}
	}

	async updateListOrder(
		projectId: string,
		dto: UpdateListsOrderDto,
		teamId: string
	) {
		try {
			return await this.prisma.$transaction(
				dto.ids.map((id, order) =>
					this.prisma.list.update({
						where: {
							id,
							project: {
								id: projectId,
								teamId
							}
						},
						data: { order }
					})
				)
			)
		} catch (error) {
			throw new BadRequestException('Reorder exception')
		}
	}

	async deleteList(projectId: string, dto: DeleteListDto, teamId: string) {
		try {
			return await this.prisma.list.delete({
				where: {
					id: dto.listId,
					project: {
						id: projectId,
						teamId
					}
				}
			})
		} catch (error) {
			throw new BadRequestException('List not found')
		}
	}
}
