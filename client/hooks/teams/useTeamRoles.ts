import { useQuery } from "@tanstack/react-query"

import api from "@/api"

export function useTeamRoles() {
	const {
		data: roles,
		isLoading,
		refetch
	} = useQuery({
		queryKey: ["team roles"],
		queryFn: () => api.team.getTeamRoles()
	})

	return { roles, isLoading, refetch }
}
