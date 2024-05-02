import { IsNotEmpty, IsString } from 'class-validator'

export class RemoveProjectDto {
	@IsString()
	@IsNotEmpty()
	teamId: string
}
