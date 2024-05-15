import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Rights } from '@prisma/client'
import { Observable } from 'rxjs'

@Injectable()
export class DeleteRoleRightsGuard implements CanActivate {
	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()
		if (
			(request.rights as Rights[]).includes(Rights.delete_role) ||
			(request.rights as Rights[]).includes(Rights.full_access)
		)
			return true
		else throw new ForbiddenException("You don't have enough rights")
	}
}
