import AuthModule from '@/repository/modules/auth.module'
import TaskModule from '@/repository/modules/task.module'
import TimeBlockModule from '@/repository/modules/time-block.module'
import TimerModule from '@/repository/modules/timer.module'
import TokenModule from '@/repository/modules/token.module'
import UserModule from '@/repository/modules/user.module'

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
