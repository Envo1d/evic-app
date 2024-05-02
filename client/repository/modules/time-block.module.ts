import type {
	ITimeBlockResponse,
	TypeTimeBlockFormState
} from '@/types/time-block.types'

import HttpFactory from '../factory'

class TimeBlockModule extends HttpFactory {
	private URL = '/time-blocks'

	async getTimeBlocks(): Promise<ITimeBlockResponse[]> {
		const res = await this.call<ITimeBlockResponse[]>('GET', this.URL)

		return res
	}

	async createTimeBlock(
		data: TypeTimeBlockFormState
	): Promise<ITimeBlockResponse> {
		const res = await this.call<ITimeBlockResponse>('POST', this.URL, data)

		return res
	}

	async updateOrderTimeBlock(ids: string[]): Promise<ITimeBlockResponse[]> {
		const res = await this.call<ITimeBlockResponse[]>(
			'PUT',
			`${this.URL}/update-order`,
			{ ids }
		)

		return res
	}

	async updateTimeBlock(
		id: string,
		data: TypeTimeBlockFormState
	): Promise<ITimeBlockResponse> {
		const res = await this.call<ITimeBlockResponse>(
			'PUT',
			`${this.URL}/${id}`,
			data
		)

		return res
	}

	async deleteTimeBlock(id: string) {
		const res = await this.call('DELETE', `${this.URL}/${id}`)

		return res
	}
}

export default TimeBlockModule
