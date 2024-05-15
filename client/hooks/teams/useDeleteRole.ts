import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import api from "@/api"

export function useDeleteRole() {
	const queryClient = useQueryClient()

	const { mutate: deleteRole, isSuccess } = useMutation({
		mutationKey: ["delete role"],
		mutationFn: (id: string) => api.team.deleteTeamRole(id),
		onSuccess() {
			toast.success("Role deleted")
			queryClient.invalidateQueries({
				queryKey: ["team roles"]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { deleteRole, isSuccess }
}
