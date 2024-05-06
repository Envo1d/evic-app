import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TeamService } from '../team/team.service'
import { UserService } from '../user/user.service'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'

@Module({
	controllers: [ProjectController],
	providers: [ProjectService, PrismaService, TeamService, UserService]
})
export class ProjectModule {}
