"use client"

import { Copy, Trash } from "lucide-react"

import { ITaskResponse } from "@/types/task.types"

import { useDeleteTask } from "@/hooks/tasks"
import { useCopyTask } from "@/hooks/tasks/useCopyTask"

import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

interface ICardActions {
	task: ITaskResponse
}

export function CardActions({ task }: ICardActions) {
	const { deleteTask } = useDeleteTask(task.list?.projectId)
	const { copyTask } = useCopyTask(task.list?.projectId)

	const onDeleteClick = () => {
		deleteTask({ taskId: task.id, listId: task.listId })
	}

	const onCopyClick = () => {
		copyTask({ taskId: task.id, listId: task.listId })
	}

	return (
		<div className="space-y-2 mt-2">
			<p className="text-xs font-semibold">Actions</p>
			<Button
				variant="gray"
				className="w-full justify-start"
				size="inline"
				onClick={onCopyClick}
			>
				<Copy className="h-4 w-4 mr-2" /> Copy
			</Button>
			<Button
				variant="gray"
				className="w-full justify-start"
				size="inline"
				onClick={onDeleteClick}
			>
				<Trash className="h-4 w-4 mr-2" /> Delete
			</Button>
		</div>
	)
}

CardActions.Skeleton = function ActionSkeleton() {
	return (
		<div className="space-y-2 mt-2">
			<Skeleton className="w-20 h-4 bg-neutral-200" />
			<Skeleton className="w-full h-8 bg-neutral-200" />
			<Skeleton className="w-full h-8 bg-neutral-200" />
		</div>
	)
}
