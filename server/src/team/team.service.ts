import { BadRequestException, Injectable } from '@nestjs/common'
import { Rights } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'
import { AddMemberDto, DeleteInvitedMemberDto } from './dto/add-member.dto'
import { CreateTeamRoleDto } from './dto/create-team-role.dto'
import { CreateTeamDto } from './dto/create-team.dto'
import { RemoveMemberDto } from './dto/remove-member.dto'
import {
	SetMemberRoleDto,
	UpdateMemberRoleDto
} from './dto/update-member-role.dto'
import { UpdateTeamDto } from './dto/update-team.dto'

@Injectable()
export class TeamService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}

	async create(dto: CreateTeamDto, userId: string) {
		return await this.prisma.team.create({
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

	async createRole(dto: CreateTeamRoleDto, userId: string) {
		const user = await this.isCreatorOrMember(dto.teamId, userId)

		if (user.creator)
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
		if (user.member) {
			if (
				(
					await this.memberRights(user.memberData.id, user.memberData.teamId)
				).role.rights.includes(Rights.add_member)
			) {
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
		}
	}

	async setMemberRole(dto: SetMemberRoleDto, userId: string) {
		const user = await this.isCreatorOrMember(dto.teamId, userId)

		if (user.creator)
			return await this.prisma.teamMember.create({
				data: {
					user: {
						connect: {
							id: dto.userId
						}
					},
					team: {
						connect: {
							id: dto.teamId
						}
					},
					role: {
						connect: {
							id: dto.roleId
						}
					}
				}
			})
		if (user.member) {
			if (
				(
					await this.memberRights(user.memberData.id, user.memberData.teamId)
				).role.rights.includes(Rights.edit_member)
			) {
				return await this.prisma.teamMember.create({
					data: {
						user: {
							connect: {
								id: dto.userId
							}
						},
						team: {
							connect: {
								id: dto.teamId
							}
						},
						role: {
							connect: {
								id: dto.roleId
							}
						}
					}
				})
			}
		}
	}

	async updateMemberRole(dto: UpdateMemberRoleDto, userId: string) {
		const user = await this.isCreatorOrMember(dto.teamId, userId)
		if (user.creator)
			return await this.prisma.teamMember.update({
				where: {
					id: dto.memberId,
					teamId: dto.teamId
				},
				data: {
					role: {
						connect: {
							id: dto.roleId
						}
					}
				}
			})
		if (user.member) {
			if (
				(
					await this.memberRights(user.memberData.id, user.memberData.teamId)
				).role.rights.includes(Rights.edit_member)
			) {
				return await this.prisma.teamMember.update({
					where: {
						id: dto.memberId,
						teamId: dto.teamId
					},
					data: {
						role: {
							connect: {
								id: dto.roleId
							}
						}
					}
				})
			}
		}
	}

	async inviteMember(userId: string, dto: AddMemberDto) {
		const user = await this.isCreatorOrMember(dto.teamId, userId)

		const candidate = await this.userService.getByEmail(dto.candidateEmail)
		if (!candidate) throw new BadRequestException('User not found')

		if (user.creator) {
			return await this.prisma.teamInvitation.create({
				data: {
					candidate: {
						connect: {
							id: candidate.id
						}
					},
					team: {
						connect: {
							id: dto.teamId
						}
					}
				}
			})
		}
		if (user.member) {
			const rights = await this.memberRights(
				user.memberData.id,
				user.memberData.teamId
			)
			if (rights.role.rights.includes(Rights.add_member)) {
				return await this.prisma.teamInvitation.create({
					data: {
						candidate: {
							connect: {
								email: dto.candidateEmail
							}
						},
						team: {
							connect: {
								id: dto.teamId
							}
						}
					}
				})
			} else throw new BadRequestException("You don't have enough rights")
		}
	}

	async deleteInvitedMember(userId: string, dto: DeleteInvitedMemberDto) {
		const user = await this.isCreatorOrMember(dto.teamId, userId)
		if (user.creator) {
			return await this.prisma.teamInvitation.delete({
				where: {
					id: dto.invitationId,
					teamId: dto.teamId,
					candidateId: dto.candidateId
				}
			})
		}
		if (user.member) {
			const rights = await this.memberRights(
				user.memberData.id,
				user.memberData.teamId
			)
			if (rights.role.rights.includes(Rights.edit_member)) {
				return await this.prisma.teamInvitation.delete({
					where: {
						id: dto.invitationId,
						teamId: dto.teamId,
						candidateId: dto.candidateId
					}
				})
			} else throw new BadRequestException("You don't have enough rights")
		}
	}

	async acceptInvite(inviteId: string, userId: string) {
		const invite = await this.prisma.teamInvitation.findUnique({
			where: {
				id: inviteId
			}
		})
		if (!invite) throw new BadRequestException('Invite record not found')

		if (invite.candidateId !== userId)
			throw new BadRequestException('Incorrect data')

		const roles = await this.prisma.teamRole.findMany({
			where: {
				teamId: invite.teamId
			}
		})

		const newMember = await this.prisma.teamMember.create({
			data: {
				team: {
					connect: {
						id: invite.teamId
					}
				},
				user: {
					connect: {
						id: invite.candidateId
					}
				},
				role: {
					connect: {
						id: roles.find(item => item.name === 'Member').id
					}
				}
			}
		})
		if (newMember) {
			await this.prisma.teamInvitation.delete({
				where: {
					id: invite.id
				}
			})
		}

		return true
	}

	async declineInvite(inviteId: string, userId: string) {
		const invite = await this.prisma.teamInvitation.findUnique({
			where: {
				id: inviteId
			}
		})
		if (!invite) throw new BadRequestException('Invite record not found')

		if (invite.candidateId !== userId)
			throw new BadRequestException('Incorrect data')

		await this.prisma.teamInvitation.delete({
			where: {
				id: invite.id
			}
		})

		return true
	}

	async getTeamInvitations(teamId: string, userId: string) {
		await this.isCreatorOrMember(teamId, userId)

		return await this.prisma.teamInvitation.findMany({
			where: {
				teamId
			},
			include: {
				candidate: {
					select: {
						id: true,
						nickname: true,
						email: true,
						firstName: true,
						lastName: true,
						avatarPath: true
					}
				}
			}
		})
	}

	async getUserInvitations(userId: string) {
		return await this.prisma.teamInvitation.findMany({
			where: {
				candidateId: userId
			},
			include: {
				team: true
			}
		})
	}

	private async memberRights(memberId: string, teamId: string) {
		return this.prisma.teamMember.findUnique({
			where: {
				id: memberId,
				teamId
			},
			include: {
				role: {
					select: {
						rights: true
					}
				}
			}
		})
	}

	async removeMember(teamId: string, dto: RemoveMemberDto, userId: string) {
		if (await this.isCreatorOrMember(teamId, userId)) {
			return await this.prisma.teamMember.delete({
				where: {
					id: dto.memberId,
					teamId,
					userId: dto.userId
				}
			})
		}
	}

	async isCreatorOrMember(teamId: string, userId?: string, memberId?: string) {
		const isMember = await this.prisma.teamMember.findFirst({
			where: {
				userId,
				teamId,
				id: memberId
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

		if (isCreator) return { creator: true }
		if (isMember) return { member: true, memberData: isMember }

		throw new BadRequestException('User is not member of this team')
	}

	async getTeamRoles(teamId: string, userId: string) {
		const user = await this.isCreatorOrMember(teamId, userId)
		if (user.member || user.creator) {
			return await this.prisma.teamRole.findMany({
				where: {
					teamId
				}
			})
		}
	}

	async getTeamDetails(teamId: string, userId: string) {
		const user = await this.isCreatorOrMember(teamId, userId)
		if (user.member || user.creator) {
			return await this.prisma.team.findUnique({
				where: {
					id: teamId
				},
				include: {
					members: {
						include: {
							role: {
								select: {
									id: true,
									name: true
								}
							},
							user: {
								select: {
									id: true,
									firstName: true,
									lastName: true,
									nickname: true,
									avatarPath: true,
									email: true
								}
							}
						}
					},
					creator: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							nickname: true,
							avatarPath: true,
							email: true
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
			select: {
				team: {
					select: {
						id: true,
						name: true
					}
				}
			}
		})

		const teams = member.map(item => ({
			id: item.team.id,
			name: item.team.name
		}))

		return {
			createdByUser,
			member: teams
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
