import type { Metadata } from "next"

import { NO_INDEX_PAGE } from "@/config/site"

export const metadata: Metadata = {
	title: "Dashboard",
	...NO_INDEX_PAGE
}

export default function Page() {
	return <div>Dashboard</div>
}
