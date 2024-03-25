import { Transform } from 'class-transformer'
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator'
import { Priority, Status } from 'prisma/generated/client'

export class TaskDto {
	@IsString()
	@IsOptional()
	name: string

	@IsString()
	@IsOptional()
	description?: string

	@IsEnum(Status)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toLowerCase())
	status?: Status

	@IsDateString()
	@IsOptional()
	deadline: string

	@IsEnum(Priority)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toLowerCase())
	priority?: Priority
}
