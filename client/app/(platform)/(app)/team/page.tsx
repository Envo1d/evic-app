import type { Metadata } from "next"

import { NO_INDEX_PAGE } from "@/config/site"

import { Dashboard } from "./dashboard"

export const metadata: Metadata = {
	title: "Dashboard",
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return <Dashboard />
}
