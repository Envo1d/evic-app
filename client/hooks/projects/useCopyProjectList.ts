import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { ICopyListForm } from "@/types/project.types"

import api from "@/api"

export function useCopyProjectList(projectId: string) {
	const queryClient = useQueryClient()

	const {
		mutate: copyList,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["copy list"],
		mutationFn: (data: ICopyListForm) => api.project.copyList(projectId, data),
		onSuccess() {
			toast.success("List copied")
			queryClient.invalidateQueries({
				queryKey: ["project", projectId]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { copyList, isSuccess, isError }
}
