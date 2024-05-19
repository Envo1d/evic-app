import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { IUpdateListsOrderForm } from "@/types/project.types"

import api from "@/api"

export function useUpdateProjectListsOrder(projectId: string) {
	const queryClient = useQueryClient()

	const {
		mutate: updateListsOrder,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["update list title"],
		mutationFn: (data: IUpdateListsOrderForm) =>
			api.project.updateListsOrder(projectId, data),
		onSuccess() {
			toast.success("Lists order updated")
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { updateListsOrder, isSuccess, isError }
}
