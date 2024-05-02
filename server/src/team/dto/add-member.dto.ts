import { IsNotEmpty, IsString } from 'class-validator'

export class AddMemberDto {
	@IsString()
	@IsNotEmpty()
	userId: string

	@IsString()
	@IsNotEmpty()
	teamId: string

	@IsString()
	@IsNotEmpty()
	roleId: string
}
