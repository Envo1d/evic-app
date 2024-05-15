import { useQuery } from "@tanstack/react-query"

import { useGetActiveTeam } from "../teams"

import api from "@/api"

export function useProjectsList() {
	const {
		data: activeTeam,
		isLoading: isActiveLoading,
		isSuccess: isActiveSuccess
	} = useGetActiveTeam()

	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ["projects", activeTeam?.activeTeamId],
		queryFn: () => api.project.getAllProjects(activeTeam?.activeTeamId!),
		enabled: !isActiveLoading && isActiveSuccess
	})

	return { data, isLoading, isSuccess, refetch }
}
