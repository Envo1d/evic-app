"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

import { useTask } from "@/hooks/tasks/useTask"
import { useCardModal } from "@/hooks/useCardModal"

import { CardActions } from "./card-actions"
import { CardDescription } from "./card-description"
import { CardHeader } from "./card-header"

export function CardModal() {
	const id = useCardModal(state => state.id)
	const isOpen = useCardModal(state => state.isOpen)
	const onClose = useCardModal(state => state.onClose)
	const onOpen = useCardModal(state => state.onOpen)

	const { task, isLoading } = useTask(id!)

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}
		>
			<DialogContent onOpenAutoFocus={e => e.preventDefault()}>
				{isLoading ? <CardHeader.Skeleton /> : <CardHeader task={task!} />}
				<div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
					<div className="col-span-3">
						<div className="w-full space-y-6">
							{isLoading ? (
								<CardDescription.Skeleton />
							) : (
								<CardDescription task={task!} />
							)}
						</div>
					</div>
					{isLoading ? <CardActions.Skeleton /> : <CardActions task={task!} />}
				</div>
			</DialogContent>
		</Dialog>
	)
}
