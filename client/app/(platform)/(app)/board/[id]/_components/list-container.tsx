"use client"

import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd"
import { useEffect, useState } from "react"

import { IProjectListResponse } from "@/types/project.types"

import { useUpdateProjectListsOrder } from "@/hooks/projects"
import { useUpdateOrderOnList } from "@/hooks/tasks/useUpdateOrderOnList"

import { ListForm } from "./list-form"
import { ListItem } from "./list-item"
import { reorder } from "@/lib/utils"

interface IListContainer {
	projectId: string
	lists: IProjectListResponse[]
}

export function ListContainer({ projectId, lists }: IListContainer) {
	const { updateListsOrder } = useUpdateProjectListsOrder(projectId)
	const { updateTasksOrderOnList } = useUpdateOrderOnList(projectId)
	const [orderedData, setOrderedData] = useState(lists)

	const onDragEnd = (res: DropResult) => {
		const { destination, source, type } = res

		if (!destination) return

		// Dropped in the same pos
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		)
			return

		// User moves a list
		if (type === "list") {
			const items = reorder(orderedData, source.index, destination.index).map(
				(item, index) => ({ ...item, order: index })
			)
			setOrderedData(items)
			const itemsIds = items.map(item => item.id)
			updateListsOrder({ ids: itemsIds })
		}

		// User moves a card
		if (type === "card") {
			let newOrderedData = [...orderedData]

			// Source and destination list
			const sourceList = newOrderedData.find(
				list => list.id === source.droppableId
			)
			const destinationList = newOrderedData.find(
				list => list.id === destination.droppableId
			)

			if (!sourceList || !destinationList) return

			// Check if cards exists on the sourceList
			if (!sourceList.tasks) {
				sourceList.tasks = []
			}

			// Check if cards exists on the destinationList
			if (!destinationList.tasks) {
				destinationList.tasks = []
			}

			// Moving the card in the same list
			if (source.droppableId === destination.droppableId) {
				const reorderedCards = reorder(
					sourceList.tasks,
					source.index,
					destination.index
				)

				reorderedCards.forEach((card, idx) => {
					card.order = idx
				})

				sourceList.tasks = reorderedCards

				setOrderedData(newOrderedData)
				const tasks = reorderedCards.map(card => {
					return {
						id: card.id,
						listId: card.listId,
						order: card.order
					}
				})
				updateTasksOrderOnList({ tasks })
			}
			// User moves the card to another list
			else {
				// Remove card from the source list
				const [movedCard] = sourceList.tasks.splice(source.index, 1)

				// Assign the new listId to the moved card
				movedCard.listId = destination.droppableId

				// Add card to the destination list
				destinationList.tasks.splice(destination.index, 0, movedCard)

				sourceList.tasks.forEach((card, index) => {
					card.order = index
				})

				// Update the order for each card in the destination list
				destinationList.tasks.forEach((card, index) => {
					card.order = index
				})

				setOrderedData(newOrderedData)
				const tasks = destinationList.tasks.map(card => {
					return {
						id: card.id,
						listId: card.listId,
						order: card.order
					}
				})
				updateTasksOrderOnList({ tasks })
			}
		}
	}

	useEffect(() => {
		setOrderedData(lists)
	}, [lists])

	return (
		<DragDropContext onDragEnd={e => onDragEnd(e)}>
			<Droppable
				droppableId="lists"
				type="list"
				direction="horizontal"
			>
				{provided => (
					<ol
						{...provided.droppableProps}
						ref={provided.innerRef}
						className="flex gap-x-3 h-full"
					>
						{orderedData.map((list, index) => {
							return (
								<ListItem
									key={list.id}
									index={index}
									data={list}
								/>
							)
						})}
						{provided.placeholder}
						<ListForm projectId={projectId} />
						<div className="flex-shrink-0 w-1" />
					</ol>
				)}
			</Droppable>
		</DragDropContext>
	)
}
