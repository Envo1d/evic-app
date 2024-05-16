import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateListTitleDto {
	@IsString()
	@IsNotEmpty()
	listId: string

	@IsString()
	@IsNotEmpty()
	title: string
}
