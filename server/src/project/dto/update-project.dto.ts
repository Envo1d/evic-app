import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateProjectDto {
	@IsString()
	@IsOptional()
	name?: string

	@IsString()
	@IsNotEmpty()
	teamId: string
}
