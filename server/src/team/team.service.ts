import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'
import { AddMemberDto, DeleteInvitedMemberDto } from './dto/add-member.dto'
import {
	CreateTeamRoleDto,
	UpdateTeamRoleDto
} from './dto/create-team-role.dto'
import { CreateTeamDto } from './dto/create-team.dto'
import { RemoveMemberDto } from './dto/remove-member.dto'
import { UpdateMemberRoleDto } from './dto/update-member-role.dto'
import { UpdateTeamDto } from './dto/update-team.dto'

@Injectable()
export class TeamService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}

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
								rights: ['full_access']
							},
							{
								name: 'Member',
								rights: []
							}
						]
					}
				}
			},
			include: {
				roles: true
			}
		})

		const teamMember = await this.prisma.teamMember.create({
			data: {
				user: {
					connect: {
						id: userId
					}
				},
				team: {
					connect: {
						id: team.id
					}
				},
				role: {
					connect: {
						id: team.roles.find(item => item.name === 'Admin').id
					}
				}
			}
		})

		await this.prisma.userActiveTeamMember.create({
			data: {
				user: {
					connect: {
						id: userId
					}
				},
				activeTeamMember: {
					connect: {
						id: teamMember.id
					}
				}
			}
		})

		return team
	}

	async updateActiveTeamMember(teamId: string, userId: string) {
		const user = await this.isMember(teamId, userId)
		if (user.member) {
			const newData = await this.prisma.teamMember.findFirst({
				where: {
					teamId,
					userId
				},
				select: {
					id: true
				}
			})

			await this.prisma.userActiveTeamMember.delete({
				where: {
					userId
				}
			})

			const data = await this.prisma.userActiveTeamMember.create({
				data: {
					user: {
						connect: {
							id: userId
						}
					},
					activeTeamMember: {
						connect: {
							id: newData.id
						}
					}
				},
				include: {
					activeTeamMember: {
						include: {
							team: {
								select: {
									id: true
								}
							},
							role: {
								select: {
									name: true,
									rights: true,
									id: true
								}
							}
						}
					}
				}
			})
			return {
				activeTeamId: data.activeTeamMember.teamId,
				activeRole: {
					name: data.activeTeamMember.role.name,
					rights: data.activeTeamMember.role.rights,
					id: data.activeTeamMember.role.id
				},
				activeTeamMemberId: data.activeTeamMemberId
			}
		}
	}

	async getActiveTeamMember(userId: string) {
		const data = await this.prisma.userActiveTeamMember.findFirst({
			where: {
				userId
			},
			include: {
				activeTeamMember: {
					include: {
						team: {
							select: {
								id: true
							}
						},
						role: {
							select: {
								name: true,
								rights: true,
								id: true
							}
						}
					}
				}
			}
		})
		if (!data) throw new BadRequestException('Active team not found')
		return {
			activeTeamId: data.activeTeamMember.teamId,
			activeRole: {
				name: data.activeTeamMember.role.name,
				rights: data.activeTeamMember.role.rights,
				id: data.activeTeamMember.role.id
			},
			activeTeamMemberId: data.activeTeamMemberId
		}
	}

	async createRole(dto: CreateTeamRoleDto, teamId: string) {
		return await this.prisma.teamRole.create({
			data: {
				name: dto.name,
				rights: dto.rights,

				team: {
					connect: {
						id: teamId
					}
				}
			}
		})
	}

	async updateRole(dto: UpdateTeamRoleDto, teamId: string, roleId: string) {
		return await this.prisma.teamRole.update({
			where: {
				id: roleId,
				teamId
			},
			data: {
				name: dto.name,
				rights: dto.rights
			}
		})
	}

	async deleteRole(id: string, teamId: string) {
		return await this.prisma.teamRole.delete({
			where: {
				id,
				teamId
			}
		})
	}

	async updateMemberRole(dto: UpdateMemberRoleDto, teamId: string) {
		return await this.prisma.teamMember.update({
			where: {
				id: dto.memberId,
				teamId: teamId
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

	async inviteMember(dto: AddMemberDto, teamId: string) {
		const candidate = await this.userService.getByEmail(dto.candidateEmail)

		if (!candidate) throw new BadRequestException('User not found')

		return await this.prisma.teamInvitation.create({
			data: {
				candidate: {
					connect: {
						email: dto.candidateEmail
					}
				},
				team: {
					connect: {
						id: teamId
					}
				}
			}
		})
	}

	async deleteInvitedMember(dto: DeleteInvitedMemberDto, teamId: string) {
		return await this.prisma.teamInvitation.delete({
			where: {
				id: dto.invitationId,
				teamId: teamId,
				candidateId: dto.candidateId
			}
		})
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

	async getTeamInvitations(teamId: string) {
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

	async removeMember(teamId: string, dto: RemoveMemberDto) {
		return await this.prisma.teamMember.delete({
			where: {
				id: dto.memberId,
				teamId
			}
		})
	}

	async isMember(teamId: string, userId: string) {
		const isMember = await this.prisma.teamMember.findFirst({
			where: {
				teamId,
				userId
			}
		})

		if (isMember) return { member: true, memberData: isMember }

		throw new BadRequestException('User is not member of this team')
	}

	async getTeamRoles(teamId: string) {
		return await this.prisma.teamRole.findMany({
			where: {
				teamId
			}
		})
	}

	async getTeamDetails(teamId: string) {
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
				}
			}
		})
	}

	async findAllUserTeams(userId: string) {
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
