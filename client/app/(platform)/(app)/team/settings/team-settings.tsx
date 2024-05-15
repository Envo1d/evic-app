"use client"

import { Settings, User, UsersRound } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from "@/components/ui/resizable"

import { useTeam } from "@/hooks/teams"

import { MembersTab } from "./_components/members-tab"
import { SettingsTab } from "./_components/settings-tab"
import { cn } from "@/lib/utils"

export function TeamSettings() {
	const { data } = useTeam()

	const [isMembersTab, setIsMembersTab] = useState(true)

	return (
		<section className={cn("w-full", isMembersTab ? "h-[80svh]" : "h-fit")}>
			<Card className="border-none shadow-2xl h-full">
				<ResizablePanelGroup
					direction="horizontal"
					className="w-full rounded-lg"
				>
					<ResizablePanel
						defaultSize={30}
						maxSize={30}
						minSize={25}
					>
						<div className="flex flex-col pt-6 px-8 ">
							<div className="flex flex-row gap-1 items-center w-full mb-5">
								<UsersRound
									className="bg-gradient-to-tr from-violet-500 to-blue-500 rounded-md p-1 border text-white"
									size={35}
								/>
								<p className="font-semibold truncate ml-3">{data?.name}</p>
							</div>
							<Button
								variant="ghost"
								className={cn(
									"mb-3 flex justify-start text-primary/70 transition-all",
									isMembersTab && "text-primary border"
								)}
								onClick={() => setIsMembersTab(true)}
							>
								<User className="mr-2 h-4 w-4" /> Members
							</Button>
							<Button
								className={cn(
									"flex justify-start text-primary/70 transition-all",
									!isMembersTab && "text-primary border"
								)}
								variant="ghost"
								onClick={() => setIsMembersTab(false)}
							>
								<Settings className="mr-2 h-4 w-4" /> Settings
							</Button>
						</div>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={70}>
						<div className="flex flex-col h-full py-11 px-8">
							<h1 className="font-semibold text-5xl mb-2">
								{isMembersTab ? "Members" : "Settings"}
							</h1>
							<p className="text-xl opacity-80 mb-8">
								{isMembersTab
									? "View and manage team members"
									: "Manage team settings"}
							</p>
							<div>{isMembersTab ? <MembersTab /> : <SettingsTab />}</div>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</Card>
		</section>
	)
}
