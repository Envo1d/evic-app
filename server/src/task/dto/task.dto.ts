import { Priority } from '@prisma/client'
import { Transform } from 'class-transformer'
import {
	IsBoolean,
	IsDateString,
	IsEnum,
	IsOptional,
	IsString
} from 'class-validator'

export class TaskDto {
	@IsString()
	@IsOptional()
	name: string

	@IsString()
	@IsOptional()
	description?: string

	@IsBoolean()
	@IsOptional()
	status?: boolean

	@IsDateString()
	@IsOptional()
	deadline: string

	@IsEnum(Priority)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toLowerCase())
	priority?: Priority

	@IsString()
	projectId: string
}
