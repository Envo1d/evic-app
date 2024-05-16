import { MoreHorizontal, X } from "lucide-react"
import { ElementRef, useRef } from "react"

import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

import { IProjectListResponse } from "@/types/project.types"

import { useDeleteProjectList } from "@/hooks/projects"
import { useCopyProjectList } from "@/hooks/projects/useCopyProjectList"

interface IListOptions {
	data: IProjectListResponse
	onAddCard: () => void
}

export function ListOptions({ data, onAddCard }: IListOptions) {
	const closeRef = useRef<ElementRef<"button">>(null)

	const { copyList } = useCopyProjectList(data.projectId)
	const { deleteList } = useDeleteProjectList(data.projectId)

	const copyListData = () => {
		copyList({ listId: data.id })
		closeRef.current?.click()
	}

	const removeList = () => {
		deleteList({ listId: data.id })
		closeRef.current?.click()
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					className="h-auto w-auto p-2"
					variant="ghost"
				>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className=" px-0 pt-3 pb-3"
				side="bottom"
				align="start"
			>
				<div className="text-sm font-medium text-center text-neutral-600 pb-4">
					List actions
				</div>
				<PopoverClose
					ref={closeRef}
					asChild
				>
					<Button
						className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
						variant="ghost"
					>
						<X className="h-4 w-4" />
					</Button>
				</PopoverClose>
				<Button
					onClick={onAddCard}
					className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
					variant="ghost"
				>
					Add card...
				</Button>
				<Button
					onClick={copyListData}
					className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
					variant="ghost"
				>
					Copy list...
				</Button>
				<Separator />
				<Button
					onClick={removeList}
					className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
					variant="ghost"
				>
					Delete this list
				</Button>
			</PopoverContent>
		</Popover>
	)
}
