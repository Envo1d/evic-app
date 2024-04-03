import type { IBase } from './root.types'

export enum EnumTaskPriority {
	low = 'low',
	medium = 'medium',
	high = 'high',
}

export enum EnumTaskStatus {
	completed = 'completed',
	incomplete = 'incomplete',
	expired = 'expired',
	canceled = 'canceled',
}

export interface ITaskResponse extends IBase {
	name: string
	priority?: EnumTaskPriority
	status?: EnumTaskStatus
	description?: string
	imagePath: string
	deadline: string
	color?: string
}

export type TypeTaskFormState = Partial<Omit<ITaskResponse, 'id' | 'updatedAt'>>
