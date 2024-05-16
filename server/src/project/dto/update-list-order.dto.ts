import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export class UpdateListOrderDto {
	@IsString()
	@IsNotEmpty()
	listId: string

	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	order: number
}
