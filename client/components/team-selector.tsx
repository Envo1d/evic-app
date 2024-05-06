"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Building, ChevronsUpDown } from "lucide-react"
import { useEffect, useState } from "react"

import { useAppStore } from "@/providers/store-provider"

import { useTeamList } from "@/hooks/teams/useTeamList"

import { Button } from "./ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "./ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import api from "@/api"
import { cn } from "@/lib/utils"

export function TeamSelector() {
	const { data: teams, isLoading } = useTeamList()

	const { activeTeamId, setActiveTeamId } = useAppStore(state => state)

	const queryClient = useQueryClient()

	const [open, setOpen] = useState(false)
	const [value, setValue] = useState(activeTeamId)

	useEffect(() => {
		if (activeTeamId !== "0") {
			setValue(activeTeamId)
		}
	}, [activeTeamId])

	const changeTeam = async (value: string) => {
		setActiveTeamId(value)
		await queryClient.fetchQuery({
			queryKey: ["team"],
			queryFn: () => api.team.getTeamDetails(value)
		})
		setOpen(false)
	}

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between h-1/3 border-none"
				>
					{value !== "0" ? (
						<div className="flex flex-row gap-1 items-center w-full">
							<Building
								className="bg-gradient-to-tr from-violet-500 to-blue-500 rounded-md p-1 border text-white"
								size={35}
							/>
							<p className="font-semibold truncate">
								{teams?.createdByUser.find(team => team.id === value)?.name ||
									teams?.member.find(team => team.id === value)?.name}
							</p>
						</div>
					) : (
						"Select team..."
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			{!isLoading && (
				<PopoverContent className="w-[300px] p-0">
					<Command>
						<CommandInput placeholder="Search team..." />
						<CommandEmpty>No teams found.</CommandEmpty>
						<CommandGroup>
							<CommandList>
								{teams?.createdByUser.map(team => (
									<CommandItem
										key={team.id}
										value={team.id}
										onSelect={currentValue => changeTeam(currentValue)}
									>
										<div
											className={cn(
												"p-2 rounded-lg shadow-md hover:translate-x-1  transition-all flex flex-row gap-1  items-center hover:shadow-xl w-full cursor-pointer",
												value === team.id
													? "bg-slate-200 hover:bg-slate-300 border"
													: ""
											)}
										>
											<Building
												className="bg-gradient-to-tr from-violet-500 to-blue-500 w-11 h-11 rounded-md p-1 text-white"
												size={35}
											/>
											<p className="font-semibold truncate">{team.name}</p>
										</div>
									</CommandItem>
								))}
								{teams?.member.map(team => (
									<CommandItem
										key={team.id}
										value={team.id}
										onSelect={currentValue => {
											setValue(currentValue === value ? "" : currentValue)
											setOpen(false)
										}}
									>
										<div
											className={cn(
												"p-2 rounded-lg shadow-md hover:translate-x-1  transition-all flex flex-row gap-1 items-center hover:shadow-xl w-full cursor-pointer",
												value === team.id
													? "bg-slate-200 hover:bg-slate-300 border"
													: ""
											)}
										>
											<Building
												className="bg-gradient-to-tr from-violet-500 to-blue-500 w-11 h-11 rounded-md p-1 text-white"
												size={35}
											/>
											<p className="font-semibold truncate">{team.name}</p>
										</div>
									</CommandItem>
								))}
							</CommandList>
						</CommandGroup>
					</Command>
				</PopoverContent>
			)}
		</Popover>
	)
}
