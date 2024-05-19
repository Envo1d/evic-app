import { ArrayMinSize, IsArray, IsString } from 'class-validator'

export class UpdateListsOrderDto {
	@IsArray()
	@IsString({ each: true })
	@ArrayMinSize(2)
	ids: string[]
}
