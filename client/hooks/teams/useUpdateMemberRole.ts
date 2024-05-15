import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { ITeamUpdateMemberRoleForm } from "@/types/team.types"

import api from "@/api"

export function useUpdateMemberRole() {
	const queryClient = useQueryClient()

	const {
		mutate: updateMemberRole,
		isSuccess,
		isError
	} = useMutation({
		mutationKey: ["update member role"],
		mutationFn: (data: ITeamUpdateMemberRoleForm) =>
			api.team.updateMemberRole(data),
		onSuccess() {
			toast.success("Member role updated")
			queryClient.invalidateQueries({ queryKey: ["team"] })
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { updateMemberRole, isSuccess, isError }
}
