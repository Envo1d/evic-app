import { IBase } from "./root.types"
import { ITaskResponse } from "./task.types"
import { IUser } from "./user.types"

export interface ICommentResponse extends IBase {
	text: string
	user: IUser
	task: ITaskResponse
}
