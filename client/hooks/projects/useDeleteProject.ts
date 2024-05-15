import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { useGetActiveTeam } from "../teams"

import api from "@/api"

export function useDeleteProject() {
	const { data } = useGetActiveTeam()
	const { push } = useRouter()
	const queryClient = useQueryClient()

	const {
		mutate: deleteProject,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["delete project"],
		mutationFn: (id: string) =>
			api.project.deleteProject(id, { teamId: data?.activeTeamId! }),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["projects"] })
			toast.success("Board deleted")
			push("/team")
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { deleteProject, isError, isSuccess }
}
