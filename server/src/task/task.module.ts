import { Module } from '@nestjs/common'
import { TeamService } from 'src/team/team.service'
import { UserService } from 'src/user/user.service'
import { PrismaService } from '../prisma/prisma.service'
import { TaskController } from './task.controller'
import { TaskService } from './task.service'

@Module({
	controllers: [TaskController],
	providers: [TaskService, PrismaService, TeamService, UserService],
	exports: [TaskService]
})
export class TaskModule {}
