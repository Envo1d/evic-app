import { IsNotEmpty, IsString } from 'class-validator'

export class AddProjectMemberDto {
	@IsString()
	@IsNotEmpty()
	teamMemberId: string

	@IsString()
	@IsNotEmpty()
	projectId: string

	@IsString()
	@IsNotEmpty()
	teamId: string
}
