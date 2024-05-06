import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'
import { TeamController } from './team.controller'
import { TeamService } from './team.service'

@Module({
	controllers: [TeamController],
	providers: [TeamService, PrismaService, UserService],
	exports: [TeamService]
})
export class TeamModule {}
