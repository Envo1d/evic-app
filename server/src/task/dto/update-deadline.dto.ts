import { IsDateString, IsNotEmpty, IsString } from 'class-validator'

export class UpdateDeadlineDto {
	@IsDateString()
	@IsNotEmpty()
	deadline: string

	@IsString()
	@IsNotEmpty()
	taskId: string

	@IsString()
	@IsNotEmpty()
	listId: string
}
