import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name)

	async onModuleInit() {
		try {
			await this.$connect()
			this.logger.log('Connected to database')
		} catch (error) {
			this.logger.error("Can't connect to database")
			await this.$disconnect()
			throw new Error("Can't connect to database")
		}
	}

	async onModuleDestroy() {
		await this.$disconnect()
	}
}
