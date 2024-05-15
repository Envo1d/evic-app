import { IsNotEmpty, IsString } from 'class-validator'

export class RemoveMemberDto {
	@IsString()
	@IsNotEmpty()
	memberId: string
}
