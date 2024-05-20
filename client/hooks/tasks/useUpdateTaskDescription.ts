import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { IUpdateTaskDescription } from "@/types/task.types"

import api from "@/api"

export function useUpdateTaskDescription(projectId: string, taskId: string) {
	const queryClient = useQueryClient()

	const {
		mutate: updateTaskDescription,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["update card description"],
		mutationFn: (data: IUpdateTaskDescription) =>
			api.task.updateTaskDescription(projectId, data),
		onSuccess() {
			toast.success("Card description updated")
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

	return { updateTaskDescription, isSuccess, isError }
}
