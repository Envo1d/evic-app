import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { IUpdateTaskName } from "@/types/task.types"

import api from "@/api"

export function useUpdateTaskTitle(projectId: string, taskId: string) {
	const queryClient = useQueryClient()

	const {
		mutate: updateTaskTitle,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["update card title"],
		mutationFn: (data: IUpdateTaskName) =>
			api.task.updateTaskName(projectId, data),
		onSuccess() {
			toast.success("Card title updated")
			queryClient.invalidateQueries({
				queryKey: ["task", taskId]
			})
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { updateTaskTitle, isSuccess, isError }
}
