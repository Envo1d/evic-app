import { IsNotEmpty, IsString } from 'class-validator'

export class AddMemberDto {
	@IsString()
	@IsNotEmpty()
	candidateEmail: string
}

export class DeleteInvitedMemberDto {
	@IsString()
	@IsNotEmpty()
	invitationId: string

	@IsString()
	@IsNotEmpty()
	candidateId: string
}
