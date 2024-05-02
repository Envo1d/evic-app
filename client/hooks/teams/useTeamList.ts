import { useQuery } from "@tanstack/react-query"

import api from "@/api"

export function useTeamList() {
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ["teams"],
		queryFn: () => api.team.getUserTeams()
	})

	return { data, isLoading, isSuccess }
}
