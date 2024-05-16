import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteListDto {
	@IsString()
	@IsNotEmpty()
	listId: string
}
