import { LucideIcon } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { UseFormWatch } from "react-hook-form"

import { ITaskResponse, TypeTaskFormState } from "./task.types"
import AuthModule from "@/repository/modules/auth.module"
import ProjectModule from "@/repository/modules/project.module"
import TaskModule from "@/repository/modules/task.module"
import TeamModule from "@/repository/modules/team.module"
import TimeBlockModule from "@/repository/modules/time-block.module"
import TimerModule from "@/repository/modules/timer.module"
import TokenModule from "@/repository/modules/token.module"
import UserModule from "@/repository/modules/user.module"

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
	team: TeamModule
	project: ProjectModule
}

export interface IMenuItem {
	link: string
	name: string
	icon: LucideIcon
}

export interface IUseTaskDebounce {
	watch: UseFormWatch<TypeTaskFormState>
	itemId: string
}

export interface IListRow {
	item: ITaskResponse
	setItems: Dispatch<SetStateAction<ITaskResponse[] | undefined>>
}

export interface IKanbanCard {
	item: ITaskResponse
	setItems: Dispatch<SetStateAction<ITaskResponse[] | undefined>>
}

export interface IListRowParent {
	value: string
	label: string
	items: ITaskResponse[] | undefined
	setItems: Dispatch<SetStateAction<ITaskResponse[] | undefined>>
}

export interface IKanbanColumn {
	value: string
	label: string
	items: ITaskResponse[] | undefined
	setItems: Dispatch<SetStateAction<ITaskResponse[] | undefined>>
}

export type TypeView = "list" | "kanban"

export interface ITaskViewSwitcher {
	type: TypeView
	setType: (val: TypeView) => void
}
