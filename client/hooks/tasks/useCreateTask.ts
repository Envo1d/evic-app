import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { ICreateTask } from "@/types/task.types"

import api from "@/api"

export function useCreateTask(projectId: string) {
	const queryClient = useQueryClient()

	const { mutate: createTask, isSuccess } = useMutation({
		mutationKey: ["create task"],
		mutationFn: (data: ICreateTask) => api.task.createTask(projectId, data),
		onSuccess() {
			toast.success("Card created")
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { createTask, isSuccess }
}
