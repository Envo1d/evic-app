import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateProjectDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsOptional()
	imagePath?: string

	@IsString()
	@IsNotEmpty()
	teamId: string
}
