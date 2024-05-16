import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { ICreateListForm } from "@/types/project.types"

import api from "@/api"

export function useCreateProjectList(projectId: string) {
	const queryClient = useQueryClient()

	const {
		mutate: createList,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["create list"],
		mutationFn: (data: ICreateListForm) =>
			api.project.createList(projectId, data),
		onSuccess() {
			toast.success("List created")
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { createList, isSuccess, isError }
}
