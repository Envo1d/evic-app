import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { ITeamCreateRoleForm } from "@/types/team.types"

import api from "@/api"

export function useCreateRole() {
	const queryClient = useQueryClient()

	const { mutate: createRole, isSuccess } = useMutation({
		mutationKey: ["update role"],
		mutationFn: (data: ITeamCreateRoleForm) => api.team.createTeamRole(data),
		onSuccess() {
			toast.success("Role created")
			queryClient.invalidateQueries({
				queryKey: ["team roles"]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { createRole, isSuccess }
}
