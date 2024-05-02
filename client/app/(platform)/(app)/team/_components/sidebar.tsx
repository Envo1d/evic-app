"use client"

import { Plus } from "lucide-react"
import Link from "next/link"

import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { useAppStore } from "@/providers/store-provider"

import { useTeam, useTeamList } from "@/hooks/teams"

import { NavItem } from "./nav-item"

export function Sidebar() {
	const { activeTeamId } = useAppStore(state => state)
	const { isLoading: isLoadingTeam } = useTeam()
	const { data: teamList, isLoading: isLoadingTeamList } = useTeamList()

	if (isLoadingTeam || isLoadingTeamList) {
		return (
			<div>
				<Skeleton />
			</div>
		)
	}

	return (
		<aside>
			<div className="font-medium text-xs flex items-center mb-1">
				<span className="pl-4">Workspaces</span>
				<Button
					asChild
					type="button"
					variant="ghost"
					size="icon"
					className="ml-auto"
				>
					<Link href="/team-selection">
						<Plus className="h-4 w-4" />
					</Link>
				</Button>
			</div>
			<Accordion
				type="multiple"
				className="space-y-2"
			>
				{teamList?.createdByUser.map(team => (
					<NavItem
						key={team.id}
						isActive={activeTeamId === team.id}
						team={team}
					/>
				))}
				{teamList?.member.map(team => <p key={team.id}>{team.name}</p>)}
			</Accordion>
		</aside>
	)
}
