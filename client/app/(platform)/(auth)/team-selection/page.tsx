import type { Metadata } from "next"

import { NO_INDEX_PAGE } from "@/config/site"

import { TeamSelection } from "./team-selection"

export const metadata: Metadata = {
	title: "Team Selection",
	...NO_INDEX_PAGE
}

export default function TeamSelectionPage() {
	return <TeamSelection />
}
