import type { Metadata } from "next"

import { NO_INDEX_PAGE } from "@/config/site"

import { Board } from "./board"

export const metadata: Metadata = {
	title: "Board",
	...NO_INDEX_PAGE
}

export default function BoardPage({ params }: { params: { id: string } }) {
	return (
		<div className="h-full">
			<Board projectId={params.id} />
		</div>
	)
}
