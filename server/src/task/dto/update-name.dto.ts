import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateNameDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	taskId: string

	@IsString()
	@IsNotEmpty()
	listId: string
}
