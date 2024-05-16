import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const CurrentTeamMember = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest()

		return req.teamMemberId
	}
)
