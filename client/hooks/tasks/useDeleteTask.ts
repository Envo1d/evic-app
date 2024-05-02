import { useMutation, useQueryClient } from '@tanstack/react-query'

import api from '@/api'

export function useDeleteTask() {
	const queryClient = useQueryClient()

	const { mutate: deleteTask, isPending: isDeletePending } = useMutation({
		mutationKey: ['delete task'],
		mutationFn: (id: string) => api.task.deleteTask(id),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['tasks']
			})
		}
	})

	return { deleteTask, isDeletePending }
}
