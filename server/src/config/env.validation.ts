import { plainToInstance } from 'class-transformer'
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
	Matches,
	Max,
	Min,
	validateSync
} from 'class-validator'
import { TypeCookieSameSite } from './configuration.interface'

enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test'
}

enum CookieSameSite {
	None = 'none',
	Lax = 'lax',
	Strict = 'strict'
}

class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment

	@IsNumber()
	@Min(3000)
	@Max(65535)
	PORT: number

	@IsBoolean()
	SECURE: boolean

	@IsString()
	@IsNotEmpty()
	DOMAIN: string

	@IsEnum(CookieSameSite)
	COOKIE_SAME_SITE: TypeCookieSameSite

	@IsString()
	@IsNotEmpty()
	JWT_SECRET: string

	@IsString()
	@IsNotEmpty()
	ACCESS_TOKEN_NAME: string

	@IsString()
	@IsNotEmpty()
	REFRESH_TOKEN_NAME: string

	@IsString()
	@Matches(/([1-9]|[1-5][0-9])(d|h|s|m|y)/gi, {
		message:
			'The first characters must be a number [1-99], the rest must match the character: s-seconds, h-hours, m-months, y-years'
	})
	@IsNotEmpty()
	ACCESS_TOKEN_LIFETIME: string

	@IsString()
	@Matches(/([1-9]|[1-5][0-9])(d|h|s|m|y)/gi, {
		message:
			'The first characters must be a number [1-99], the rest must match the character: s-seconds, h-hours, m-months, y-years'
	})
	@IsNotEmpty()
	REFRESH_TOKEN_LIFETIME: string

	@IsString()
	@IsNotEmpty()
	ORIGIN: string

	@IsBoolean()
	CREDENTIALS: boolean

	@IsString()
	@IsNotEmpty()
	DATABASE_URL: string

	@IsString()
	@IsNotEmpty()
	POSTGRES_HOST: string

	@IsNumber()
	@Min(5432)
	@Max(65535)
	POSTGRES_PORT: number

	@IsString()
	@IsNotEmpty()
	POSTGRES_USER: string

	@IsString()
	@IsNotEmpty()
	POSTGRES_PASSWORD: string

	@IsString()
	@IsNotEmpty()
	POSTGRES_DB: string
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true
	})
	const errors = validateSync(validatedConfig, { skipMissingProperties: false })

	if (errors.length > 0) {
		throw new Error(errors.toString())
	}
	return validatedConfig
}
