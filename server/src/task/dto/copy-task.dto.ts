import { IsNotEmpty, IsString } from 'class-validator'

export class CopyTaskDto {
	@IsString()
	@IsNotEmpty()
	taskId: string

	@IsString()
	@IsNotEmpty()
	listId: string
}
