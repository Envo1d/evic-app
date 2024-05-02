import { useQuery } from "@tanstack/react-query"

import { useAppStore } from "@/providers/store-provider"

import api from "@/api"

export function useTeam() {
	const { activeTeamId } = useAppStore(state => state)

	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ["team"],
		queryFn: () => api.team.getTeamDetails(activeTeamId)
	})

	return { data, isLoading, isSuccess, refetch }
}
