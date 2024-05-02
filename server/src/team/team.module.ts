import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { TeamController } from './team.controller'
import { TeamService } from './team.service'

@Module({
	controllers: [TeamController],
	providers: [TeamService, PrismaService],
	exports: [TeamService]
})
export class TeamModule {}
