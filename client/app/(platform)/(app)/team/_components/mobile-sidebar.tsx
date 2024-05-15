"use client"

import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

import { useGetActiveTeam } from "@/hooks/teams"
import { useMobileSidebar } from "@/hooks/useMobileSidebar"

import { Sidebar } from "./sidebar"

export function MobileSidebar() {
	const onOpen = useMobileSidebar(state => state.onOpen)
	const onClose = useMobileSidebar(state => state.onClose)
	const isOpen = useMobileSidebar(state => state.isOpen)

	const pathname = usePathname()
	const { data } = useGetActiveTeam()

	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		onClose()
	}, [pathname, data?.activeTeamId, onClose])

	if (!isMounted) return null

	return (
		<div>
			<Button
				onClick={onOpen}
				className="block md:hidden mr-2"
				variant="ghost"
				size="sm"
			>
				<Menu className="h-4 w-4" />
			</Button>
			<Sheet
				open={isOpen}
				onOpenChange={onClose}
			>
				<SheetContent
					side="left"
					className="p-2 pt-10"
				>
					<Sidebar />
				</SheetContent>
			</Sheet>
		</div>
	)
}
