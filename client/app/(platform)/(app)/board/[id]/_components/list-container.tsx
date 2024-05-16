"use client"

import { useEffect, useState } from "react"

import { IProjectListResponse } from "@/types/project.types"

import { ListForm } from "./list-form"
import { ListItem } from "./list-item"

interface IListContainer {
	projectId: string
	lists: IProjectListResponse[]
}

export function ListContainer({ projectId, lists }: IListContainer) {
	const [orderedData, setOrderedData] = useState(lists)

	useEffect(() => {
		setOrderedData(lists)
	}, [lists])

	return (
		<ol className="flex gap-x-3 h-full">
			{orderedData.map((list, index) => {
				return (
					<ListItem
						key={list.id}
						index={index}
						data={list}
					/>
				)
			})}
			<ListForm projectId={projectId} />
			<div className="flex-shrink-0 w-1" />
		</ol>
	)
}
