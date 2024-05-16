"use client"

import { IProjectListResponse } from "@/types/project.types"

import { ListHeader } from "./list-header"

interface IListItem {
	index: number
	data: IProjectListResponse
}

export function ListItem({ index, data }: IListItem) {
	return (
		<li className="shrink-0 h-full w-[272px] select-none">
			<div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
				<ListHeader data={data} />
			</div>
		</li>
	)
}
