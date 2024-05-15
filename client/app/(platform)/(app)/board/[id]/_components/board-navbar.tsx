import { useProjectDetails } from "@/hooks/projects"

import { BoardOptions } from "./board-options"
import { BoardTitleForm } from "./board-title-form"

interface IBoardNavbar {
	id: string
}

export function BoardNavbar({ id }: IBoardNavbar) {
	const { project } = useProjectDetails(id)

	return (
		<div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
			<BoardTitleForm
				title={project?.name!}
				id={id}
			/>
			<div className="ml-auto">
				<BoardOptions id={project?.id!} />
			</div>
		</div>
	)
}
