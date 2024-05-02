import { Rights } from '@prisma/client'
import {
	ArrayMaxSize,
	ArrayMinSize,
	ArrayNotEmpty,
	IsEnum,
	IsNotEmpty,
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

	@IsString()
	@IsNotEmpty()
	teamId: string
}
