import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { ICopyTaskForm } from "@/types/task.types"

import api from "@/api"

export function useCopyTask(projectId: string) {
	const queryClient = useQueryClient()

	const {
		mutate: copyTask,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["copy task"],
		mutationFn: (data: ICopyTaskForm) => api.task.copyTask(projectId, data),
		onSuccess() {
			toast.success("Card copied")
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { copyTask, isSuccess, isError }
}
