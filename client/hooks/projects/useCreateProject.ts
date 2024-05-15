import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { IProjectCreateForm } from "@/types/project.types"

import api from "@/api"

export function useCreateProject() {
	const queryClient = useQueryClient()
	const { push } = useRouter()

	const { mutate, isPending } = useMutation({
		mutationKey: ["create project"],
		mutationFn: (data: IProjectCreateForm) => api.project.create(data),
		onSuccess(res) {
			toast.success("Board created!")
			queryClient.invalidateQueries({ queryKey: ["projects"] })
			push(`/board/${res.id}`)
		},
		onError(error) {
			toast.error(error.message)
		}
	})

	return { mutate, isPending }
}
