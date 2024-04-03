import type AuthModule from '~/repository/modules/auth.module'
import type TaskModule from '~/repository/modules/task.module'
import type TimeBlockModule from '~/repository/modules/time-block.module'
import type TimerModule from '~/repository/modules/timer.module'
import type TokenModule from '~/repository/modules/token.module'
import type UserModule from '~/repository/modules/user.module'

export interface IBase {
	id: string
	createdAt: string
	updatedAt: string
}

export interface IApiInstance {
	token: TokenModule
	auth: AuthModule
	user: UserModule
	timer: TimerModule
	timeBlock: TimeBlockModule
	task: TaskModule
}
