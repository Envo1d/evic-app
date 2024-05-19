import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsString
} from 'class-validator'

export class UpdateOrderDto {
	@IsArray()
	@IsObject({ each: true })
	@ArrayMinSize(2)
	tasks: TaskData[]
}

class TaskData {
	@IsString()
	@IsNotEmpty()
	id: string

	@IsNumber()
	@IsNotEmpty()
	order: number

	@IsString()
	@IsNotEmpty()
	listId: string
}
