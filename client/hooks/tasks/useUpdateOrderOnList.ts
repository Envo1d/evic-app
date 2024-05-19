import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { IUpdateTasksOrderOnList } from "@/types/task.types"

import api from "@/api"

export function useUpdateOrderOnList(projectId: string) {
	const queryClient = useQueryClient()

	const {
		mutate: updateTasksOrderOnList,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["update list title"],
		mutationFn: (data: IUpdateTasksOrderOnList) =>
			api.task.updateTaskOrderOnList(projectId, data),
		onSuccess() {
			toast.success("Cards order updated")
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { updateTasksOrderOnList, isSuccess, isError }
}
