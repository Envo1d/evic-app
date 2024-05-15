import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

import api from "@/api"

export function useProjectDetails(projectId: string) {
	const {
		data: project,
		isLoading,
		refetch,
		isSuccess
	} = useQuery({
		queryKey: ["project", projectId],
		queryFn: () => api.project.getProjectDetails(projectId),
		enabled: projectId.length > 0
	})

	useEffect(() => {
		if (projectId.length > 0) refetch()
	}, [projectId])

	return { project, isLoading, refetch, isSuccess }
}
