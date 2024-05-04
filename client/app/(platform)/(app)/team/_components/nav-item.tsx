"use client"

import { AccordionItem } from "@radix-ui/react-accordion"
import { useQueryClient } from "@tanstack/react-query"
import { Activity, Building, CreditCard, Layout, Settings } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { useAppStore } from "@/providers/store-provider"

import { ITeamResponse } from "@/types/team.types"

import api from "@/api"
import { cn } from "@/lib/utils"

interface NavItemProps {
	isActive: boolean
	team: ITeamResponse
}

const routes = [
	{
		label: "Boards",
		icon: <Layout className="h-4 w-4 mr-2" />,
		href: `/team`
	},
	{
		label: "Activity",
		icon: <Activity className="h-4 w-4 mr-2" />,
		href: `/team/activity`
	},
	{
		label: "Settings",
		icon: <Settings className="h-4 w-4 mr-2" />,
		href: `/team/settings`
	},
	{
		label: "Billing",
		icon: <CreditCard className="h-4 w-4 mr-2" />,
		href: `/team/billing`
	}
]

export function NavItem({ isActive, team }: NavItemProps) {
	const { push } = useRouter()
	const pathname = usePathname()
	const { activeTeamId, setActiveTeamId } = useAppStore(state => state)
	const queryClient = useQueryClient()

	const onClick = async (href: string) => {
		if (activeTeamId !== team.id) {
			setActiveTeamId(team.id)
			await queryClient.fetchQuery({
				queryKey: ["team"],
				queryFn: () => api.team.getTeamDetails(team.id)
			})
		}
		push(href)
	}

	return (
		<AccordionItem
			value={team.id}
			className="border-none"
		>
			<AccordionTrigger
				className={cn(
					"flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
					isActive && "border"
				)}
			>
				<div className="flex items-center gap-x-2">
					<div className="w-14 h-7 relative flex items-center">
						<Building
							className="bg-gradient-to-tr from-violet-500 to-blue-500 rounded-md p-1 text-white"
							size={30}
						/>
					</div>
					<span className="font-semibold text-sm">{team.name}</span>
				</div>
			</AccordionTrigger>
			<AccordionContent className="pt-1 text-neutral-700">
				{routes.map(route => (
					<Button
						key={route.href}
						size="sm"
						onClick={() => onClick(route.href)}
						className={cn(
							"w-full font-medium justify-start pl-10 mb-1",
							pathname === route.href &&
								activeTeamId === team.id &&
								"bg-sky-500/10 text-sky-700"
						)}
						variant="ghost"
					>
						{route.icon}
						{route.label}
					</Button>
				))}
			</AccordionContent>
		</AccordionItem>
	)
}

NavItem.Skeleton = function SkeletonNavItem() {
	return (
		<div className="flex items-center gap-x-2">
			<div className="w-10 h-10 relative shrink-0">
				<Skeleton className="w-14 h-7 absolute" />
			</div>
			<Skeleton className="h-10 w-full" />
		</div>
	)
}
