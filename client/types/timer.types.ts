import type { IBase } from './root.types'

export interface ITimerRoundResponse extends IBase {
	isCompleted?: boolean
	totalSeconds: number
}

export interface ITimerSessionResponse extends IBase {
	isCompleted?: boolean
	rounds?: ITimerRoundResponse[]
}

export type TypeTimerSessionFormState = Partial<
	Omit<ITimerSessionResponse, 'id' | 'createdAt' | 'updatedAt'>
>

export type TypeTimerRoundFormState = Partial<
	Omit<ITimerRoundResponse, 'id' | 'createdAt' | 'updatedAt'>
>
