import { IsNotEmpty, IsString } from 'class-validator'

export class FindProjectDto {
	@IsString()
	@IsNotEmpty()
	projectId: string
}
