import { Rights } from '@prisma/client'
import {
	ArrayMaxSize,
	ArrayMinSize,
	ArrayNotEmpty,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator'

export class CreateTeamRoleDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsEnum(Rights, { each: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(6)
	@ArrayNotEmpty()
	rights: Rights[]
}

export class UpdateTeamRoleDto {
	@IsString()
	@IsOptional()
	name?: string

	@IsEnum(Rights, { each: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(6)
	@IsOptional()
	rights?: Rights[]
}
