import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

import { useGetActiveTeam } from "./useGetActiveTeam"
import api from "@/api"

export function useTeam() {
	const { isLoading: isActiveLoading, isSuccess: isActiveSuccess } =
		useGetActiveTeam()

	const { data, isLoading, isSuccess, refetch } = useQuery({
		queryKey: ["team"],
		queryFn: () => api.team.getTeamDetails(),
		enabled: !isActiveLoading && isActiveSuccess
	})

	useEffect(() => {
		if (isActiveLoading) refetch()
	}, [isActiveLoading])

	return { data, isLoading, isSuccess, refetch }
}
