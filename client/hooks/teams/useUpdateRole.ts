import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { toast } from "sonner"

import { ITeamCreateRoleForm } from "@/types/team.types"

import api from "@/api"

export function useUpdateRole() {
	const queryClient = useQueryClient()

	const { mutate: updateRole, isSuccess } = useMutation({
		mutationKey: ["update role"],
		mutationFn: ({ id, data }: { id: string; data: ITeamCreateRoleForm }) =>
			api.team.updateTeamRole(id, data),
		onSuccess() {
			toast.success("Role updated")
			queryClient.invalidateQueries({
				queryKey: ["team roles"]
			})
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	return { updateRole, isSuccess }
}
