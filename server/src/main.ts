import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { mkdir } from 'fs/promises'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import { AppModule } from './app.module'
import { AppConfig, CorsConfig } from './config/configuration.interface'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true
	})

	const logger = app.get(Logger)
	const configService = app.get(ConfigService)

	app.useLogger(logger)
	app.useGlobalInterceptors(new LoggerErrorInterceptor())
	app.setGlobalPrefix('api')
	app.disable('x-powered-by')
	app.enableShutdownHooks()

	app.use(cookieParser())

	app.enableCors({
		origin:
			configService.get<AppConfig>('app').node_env === 'production'
				? [configService.get<CorsConfig>('cors').origin]
				: ['localhost'],
		credentials: configService.get<CorsConfig>('cors').credentials,
		exposedHeaders: 'set-cookie'
	})

	const port = configService.get<AppConfig>('app').port

	const logsDir = configService.get<AppConfig>('app').logs_path
	mkdir(logsDir)
		.then(() => logger.log(`Directory '${logsDir}' created.`))
		.catch(err => {
			if (err instanceof Error) {
				if (err.message.includes('file already exists')) {
					logger.warn('Logs directory already exists')
				} else logger.error(`Error creating directory: ${err.message}`)
			}
		})

	await app.listen(port, () => {
		logger.log(`Server started on port ${port}`)
	})
}
bootstrap()
