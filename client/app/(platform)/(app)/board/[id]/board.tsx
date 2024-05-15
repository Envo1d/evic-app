"use client"

import { Loader } from "lucide-react"

import { useProjectDetails } from "@/hooks/projects"

interface IBoard {
	projectId: string
}

export function Board({ projectId }: IBoard) {
	const { project, isLoading } = useProjectDetails(projectId)

	if (isLoading)
		return (
			<div className="flex justify-center items-center">
				<Loader className="animate-spin text-sky-700" />
			</div>
		)

	return (
		<div
			className="relative bg-no-repeat bg-cover bg-center h-full"
			style={{ backgroundImage: `url(${project?.imageFullUrl})` }}
		>
			<div className="relative pt-28 h-full">{project?.name}</div>
		</div>
	)
}
