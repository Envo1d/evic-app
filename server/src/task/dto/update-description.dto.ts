import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateDescriptionDto {
	@IsString()
	@IsNotEmpty()
	description: string

	@IsString()
	@IsNotEmpty()
	taskId: string

	@IsString()
	@IsNotEmpty()
	listId: string
}
