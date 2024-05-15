"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { useGetActiveTeam, useTeam, useTeamList } from "@/hooks/teams"

import { NavItem } from "./nav-item"

export function Sidebar() {
	const { data: activeTeam } = useGetActiveTeam()
	const { isLoading: isLoadingTeam } = useTeam()
	const { data: teamList, isLoading: isLoadingTeamList } = useTeamList()
	const [value, setValue] = useState<string[]>([activeTeam?.activeTeamId!])

	useEffect(() => {
		if (activeTeam?.activeTeamId) {
			setValue([activeTeam?.activeTeamId!])
		}
	}, [activeTeam?.activeTeamId])

	if (isLoadingTeam || isLoadingTeamList) {
		return (
			<div>
				<div className="flex items-center justify-between mb-2">
					<Skeleton className="h-10 w-[50%]" />
					<Skeleton className="h-10 w-10" />
				</div>
				<div className="space-y-2">
					<NavItem.Skeleton />
					<NavItem.Skeleton />
					<NavItem.Skeleton />
				</div>
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
				defaultValue={value}
				onValueChange={setValue}
				value={value}
			>
				{teamList?.member.map(team => (
					<NavItem
						key={team.id}
						isActive={activeTeam?.activeTeamId === team.id}
						team={team}
					/>
				))}
			</Accordion>
		</aside>
	)
}
