import { RedisModule } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import pino from 'pino'
import { createStream } from 'rotating-file-stream'
import { AuthModule } from './auth/auth.module'
import { configuration } from './config/configuration'
import { AppConfig } from './config/configuration.interface'
import { Environment, validate } from './config/env.validation'
import { getRedisConfig } from './config/redis.config'
import { PrismaModule } from './prisma/prisma.module'
import { TaskModule } from './task/task.module'
import { TimeBlockModule } from './time-block/time-block.module'
import { UserModule } from './user/user.module'
import { TimerModule } from './timer/timer.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			cache: true,
			validate
		}),
		LoggerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => {
				if (config.get<AppConfig>('app').node_env === Environment.Production)
					return {
						pinoHttp: {
							autoLogging: true,
							stream: createStream(
								`${config.get<AppConfig>('app').logs_path}/logs.json`,
								{
									interval: '1d'
								}
							),
							timestamp: pino.stdTimeFunctions.isoTime
						}
					}
				else
					return {
						pinoHttp: {
							autoLogging: true,
							transport: {
								target: 'pino-pretty',
								options: {
									singleLine: true
								}
							},
							timestamp: pino.stdTimeFunctions.isoTime
						}
					}
			}
		}),
		RedisModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getRedisConfig
		}),
		AuthModule,
		UserModule,
		PrismaModule,
		TaskModule,
		TimeBlockModule,
		TimerModule
	]
})
export class AppModule {}
