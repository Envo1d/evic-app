import {
	ITimerSessionResponse,
	TypeTimerRoundState,
	TypeTimerSessionState
} from '@/types/timer.types'

import { axiosWithAuth } from '@/api/client'

class TimerService {
	private BASE_URL = '/timer'

	async getTodaySession() {
		const res = await axiosWithAuth.get<ITimerSessionResponse>(
			`${this.BASE_URL}/today`
		)

		return res
	}

	async createSession() {
		const res = await axiosWithAuth.post<ITimerSessionResponse>(this.BASE_URL)

		return res
	}

	async updateSession(id: string, data: TypeTimerSessionState) {
		const res = await axiosWithAuth.put(`${this.BASE_URL}/${id}`, data)

		return res
	}

	async deleteSession(id: string) {
		const res = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)

		return res
	}

	async updateRound(id: string, data: TypeTimerRoundState) {
		const res = await axiosWithAuth.put(`${this.BASE_URL}/round/${id}`, data)

		return res
	}
}

export const timerService = new TimerService()
