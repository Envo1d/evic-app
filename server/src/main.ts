import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { mkdir } from 'fs/promises'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import { AppModule } from './app.module'
import { AppConfig, CorsConfig } from './config/configuration.interface'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true })

	const logger = app.get(Logger)
	const configService = app.get(ConfigService)

	app.useLogger(logger)
	app.useGlobalInterceptors(new LoggerErrorInterceptor())
	app.setGlobalPrefix('api')
	app.enableShutdownHooks()

	app.use(cookieParser())

	app.enableCors({
		origin: [configService.get<CorsConfig>('cors').origin],
		credentials: configService.get<CorsConfig>('cors').credentials,
		exposedHeaders: 'set-cookie'
	})

	const port = configService.get<AppConfig>('app').port

	const logsDir = configService.get<AppConfig>('app').logs_path
	mkdir(logsDir)
		.then(() => logger.log(`Directory '${logsDir}' created.`))
		.catch(err => logger.error(`Error creating directory: ${err.message}`))

	await app.listen(port, () => {
		logger.log(`Server started on port ${port}`)
	})
}
bootstrap()
