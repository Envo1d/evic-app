import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { IDeleteListForm } from "@/types/project.types"

import api from "@/api"

export function useDeleteProjectList(projectId: string) {
	const queryClient = useQueryClient()

	const {
		mutate: deleteList,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["create list"],
		mutationFn: (data: IDeleteListForm) =>
			api.project.deleteList(projectId, data),
		onSuccess() {
			toast.success("List deleted")
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { deleteList, isSuccess, isError }
}
