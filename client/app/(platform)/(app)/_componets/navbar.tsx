"use client"

import { Plus } from "lucide-react"

import { FormPopover } from "@/components/form-popover"
import { Logo } from "@/components/logo"
import { Profile } from "@/components/profile"
import { TeamSelector } from "@/components/team-selector"
import { Button } from "@/components/ui/button"

import { useGetActiveTeam } from "@/hooks/teams"

import { MobileSidebar } from "../team/_components/mobile-sidebar"

export function Navbar() {
	const { data } = useGetActiveTeam()

	return (
		<nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
			<MobileSidebar />
			<div className="flex items-center gap-x-4">
				<div className="hidden md:flex">
					<Logo />
				</div>
				<FormPopover
					align="start"
					side="bottom"
					sideOffset={18}
					teamMemberId={data?.activeTeamMemberId!}
				>
					<Button
						variant="primary"
						size="sm"
						className="rounded-cm hidden md:block h-auto py-1.5 px-2"
					>
						Create
					</Button>
				</FormPopover>
				<FormPopover
					align="start"
					side="bottom"
					sideOffset={18}
					teamMemberId={data?.activeTeamMemberId!}
				>
					<Button
						variant="primary"
						className="rounded-sm block md:hidden"
						size="sm"
					>
						<Plus className="h-4 w-4" />
					</Button>
				</FormPopover>
			</div>
			<div className="ml-auto flex items-center gap-x-2">
				<TeamSelector />
				<Profile />
			</div>
		</nav>
	)
}
