import type {
	ITimerSessionResponse,
	TypeTimerRoundFormState,
	TypeTimerSessionFormState
} from '@/types/timer.types'

import HttpFactory from '../factory'

class TimerModule extends HttpFactory {
	private URL = '/timer'

	async getTodaySession(): Promise<ITimerSessionResponse> {
		const res = await this.call<ITimerSessionResponse>(
			'GET',
			`${this.URL}/today`
		)

		return res
	}

	async createSession(): Promise<ITimerSessionResponse> {
		const res = await this.call<ITimerSessionResponse>('POST', `${this.URL}`)

		return res
	}

	async updateSession(
		id: string,
		data: TypeTimerSessionFormState
	): Promise<ITimerSessionResponse> {
		const res = await this.call<ITimerSessionResponse>(
			'PUT',
			`${this.URL}/${id}`,
			data
		)

		return res
	}

	async deleteSession(id: string) {
		const res = await this.call('DELETE', `${this.URL}/${id}`)

		return res
	}

	async updateRound(
		id: string,
		data: TypeTimerRoundFormState
	): Promise<ITimerSessionResponse> {
		const res = await this.call<ITimerSessionResponse>(
			'PUT',
			`${this.URL}/round/${id}`,
			data
		)

		return res
	}
}

export default TimerModule
