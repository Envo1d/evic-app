import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteTaskDto {
	@IsString()
	@IsNotEmpty()
	taskId: string

	@IsString()
	@IsNotEmpty()
	listId: string
}
