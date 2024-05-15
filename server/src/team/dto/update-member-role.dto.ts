import { IsNotEmpty, IsString } from 'class-validator'

export class SetMemberRoleDto {
	@IsString()
	@IsNotEmpty()
	userId: string

	@IsString()
	@IsNotEmpty()
	roleId: string
}

export class UpdateMemberRoleDto {
	@IsString()
	@IsNotEmpty()
	memberId: string

	@IsString()
	@IsNotEmpty()
	roleId: string
}
