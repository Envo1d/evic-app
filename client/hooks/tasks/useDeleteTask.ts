import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { IDeleteTask } from "@/types/task.types"

import api from "@/api"

export function useDeleteTask(projectId: string) {
	const queryClient = useQueryClient()

	const { mutate: deleteTask, isSuccess } = useMutation({
		mutationKey: ["delete task"],
		mutationFn: (data: IDeleteTask) => api.task.deleteTask(projectId, data),
		onSuccess() {
			toast.success("Card deleted")
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { deleteTask, isSuccess }
}
