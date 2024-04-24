import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { ITaskResponse } from '@/types/task.types'

import api from '@/api'

export function useTasks() {
	const { data } = useQuery({
		queryKey: ['tasks'],
		queryFn: () => api.task.getTasks()
	})

	const [items, setItems] = useState<ITaskResponse[] | undefined>(data)

	useEffect(() => {
		setItems(data)
	}, [data])

	return { items, setItems }
}
