import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class UpdateStatusDto {
	@IsBoolean()
	@IsNotEmpty()
	status: boolean

	@IsString()
	@IsNotEmpty()
	taskId: string

	@IsString()
	@IsNotEmpty()
	listId: string
}
