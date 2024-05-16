import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { IUpdateListTitleForm } from "@/types/project.types"

import api from "@/api"

export function useUpdateProjectListTitle(projectId: string) {
	const queryClient = useQueryClient()

	const {
		mutate: updateListTitle,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["update list title"],
		mutationFn: (data: IUpdateListTitleForm) =>
			api.project.updateListTitle(projectId, data),
		onSuccess() {
			toast.success("List updated")
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { updateListTitle, isSuccess, isError }
}
