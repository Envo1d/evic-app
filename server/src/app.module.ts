import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { AuthModule } from './auth/auth.module'
import { configuration } from './config/configuration'
import { validate } from './config/env.validation'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			cache: true,
			validate
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				customProps: (req, res) => ({
					context: 'HTTP'
				}),
				transport: {
					target: 'pino-pretty',
					options: {
						singleLine: true
					}
				}
			}
		}),
		AuthModule,
		UserModule,
		PrismaModule
	]
})
export class AppModule {}
