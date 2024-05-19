"use client"

import { Draggable, Droppable } from "@hello-pangea/dnd"
import { ElementRef, useRef, useState } from "react"

import { IProjectListResponse } from "@/types/project.types"

import { CardForm } from "./card-form"
import { CardItem } from "./card-item"
import { ListHeader } from "./list-header"
import { cn } from "@/lib/utils"

interface IListItem {
	index: number
	data: IProjectListResponse
}

export function ListItem({ index, data }: IListItem) {
	const textareaRef = useRef<ElementRef<"textarea">>(null)

	const [isEditing, setIsEditing] = useState(false)

	const enableEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			textareaRef.current?.focus()
		})
	}

	const disableEditing = () => {
		setIsEditing(false)
	}

	return (
		<Draggable
			draggableId={data.id}
			index={index}
		>
			{provided => (
				<li
					{...provided.draggableProps}
					ref={provided.innerRef}
					className="shrink-0 h-full w-[272px] select-none"
				>
					<div
						{...provided.dragHandleProps}
						className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
					>
						<ListHeader
							onAddCard={enableEditing}
							data={data}
						/>
						<Droppable
							droppableId={data.id}
							type="card"
						>
							{provided => (
								<ol
									ref={provided.innerRef}
									{...provided.droppableProps}
									className={cn(
										"mx-1 px-1 py-0.5 flex flex-col gap-y-2",
										data.tasks.length > 0 ? "mt-2" : "mt-0"
									)}
								>
									{data.tasks.map((card, index) => (
										<CardItem
											index={index}
											key={card.id}
											data={card}
										/>
									))}
									{provided.placeholder}
								</ol>
							)}
						</Droppable>
						<CardForm
							listId={data.id}
							projectId={data.projectId}
							ref={textareaRef}
							isEditing={isEditing}
							enableEditing={enableEditing}
							disableEditing={disableEditing}
						/>
					</div>
				</li>
			)}
		</Draggable>
	)
}
