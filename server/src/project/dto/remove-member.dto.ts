import { IsNotEmpty, IsString } from 'class-validator'

export class RemoveProjectMemberDto {
	@IsString()
	@IsNotEmpty()
	projectMemberId: string

	@IsString()
	@IsNotEmpty()
	projectId: string

	@IsString()
	@IsNotEmpty()
	teamMemberId: string
}
