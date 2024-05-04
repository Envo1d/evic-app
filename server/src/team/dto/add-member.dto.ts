import { IsNotEmpty, IsString } from 'class-validator'

export class AddMemberDto {
	@IsString()
	@IsNotEmpty()
	candidateId: string

	@IsString()
	@IsNotEmpty()
	teamId: string
}
