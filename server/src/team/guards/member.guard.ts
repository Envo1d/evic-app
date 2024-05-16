import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { TeamService } from '../team.service'

@Injectable()
export class MemberGuard implements CanActivate {
	constructor(private readonly teamService: TeamService) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		return this.validate(context)
	}

	async validate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		const userId = request.user.id

		const activeTeamMember = await this.teamService.getActiveTeamMember(userId)

		if (activeTeamMember.activeTeamId === request.cookies.team_id) {
			request.teamId = request.cookies.team_id
			request.rights = activeTeamMember.activeRole.rights
			request.teamMemberId = activeTeamMember.activeTeamMemberId
			return true
		} else throw new ForbiddenException('You are not a member of this team')
	}
}
