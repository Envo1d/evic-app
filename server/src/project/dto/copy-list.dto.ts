import { IsNotEmpty, IsString } from 'class-validator'

export class CopyListDto {
	@IsString()
	@IsNotEmpty()
	listId: string
}
