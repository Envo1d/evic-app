import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const CurrentTeam = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest()

		return req.teamId
	}
)
