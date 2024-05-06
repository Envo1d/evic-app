import type { Metadata } from "next"

import { NO_INDEX_PAGE } from "@/config/site"

import { TeamSettings } from "./team-settings"

export const metadata: Metadata = {
	title: "Settings",
	...NO_INDEX_PAGE
}

export default function TeamSettingsPage() {
	return <TeamSettings />
}
