import { useQuery } from "@tanstack/react-query"

import api from "@/api"

export function useGetActiveTeam() {
	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ["active team"],
		queryFn: () => api.team.getActiveTeam()
	})

	return { data, isLoading, isSuccess, refetch }
}
