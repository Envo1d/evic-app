import { useQuery } from "@tanstack/react-query"

import api from "@/api"

export function useInvitations() {
	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ["user invitations"],
		queryFn: () => api.team.getUserInvitations()
	})

	return { data, isLoading, isSuccess, refetch }
}
