"use client"

import {
	DropdownMenu,
	DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu"
import { QueryCache, useMutation, useQueryClient } from "@tanstack/react-query"
import {
	Building,
	Check,
	LogOut,
	Plus,
	SettingsIcon,
	UserPlus,
	Users,
	X
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"

import { useInvitations } from "@/hooks/teams"
import { useProfile } from "@/hooks/useProfile"

import { Settings } from "./settings"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "./ui/dialog"
import api from "@/api"

export function Profile() {
	const { data } = useProfile()
	const { data: invitations } = useInvitations()
	const queryClient = useQueryClient()
	const queryCache = new QueryCache()
	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => api.auth.logout(),
		onSuccess: () => {
			queryCache.clear()
			push("/sign-in")
		}
	})

	const { mutate: accept } = useMutation({
		mutationKey: ["accept invitations"],
		mutationFn: (id: string) => api.team.acceptInvite(id),
		onSuccess: () => {
			toast.success("Invitation accepted!")
			queryClient.invalidateQueries({ queryKey: ["teams"] })
			queryClient.invalidateQueries({ queryKey: ["user invitations"] })
		}
	})

	const { mutate: decline } = useMutation({
		mutationKey: ["decline invitations"],
		mutationFn: (id: string) => api.team.declineInvite(id),
		onSuccess: () => {
			toast.success("Invitation declined!")
			queryClient.invalidateQueries({ queryKey: ["teams"] })
			queryClient.invalidateQueries({ queryKey: ["user invitations"] })
		}
	})

	return (
		<div>
			<div className="flex items-center">
				<Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div className="relative">
								<Avatar className="cursor-pointer">
									<AvatarImage src="/default" />
									<AvatarFallback className="bg-violet-500 hover:bg-violet-900 transition-colors text-white font-medium text-xl capitalize">
										{data?.nickname?.charAt(0) ||
											data?.firstName?.charAt(0) ||
											data?.email.charAt(0)}
									</AvatarFallback>
								</Avatar>
								{invitations && invitations?.length > 0 && (
									<Badge
										className="absolute -top-1 -right-3 pointer-events-none"
										variant="primary"
									>
										{invitations?.length}
									</Badge>
								)}
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuLabel className="text-ellipsis overflow-hidden">
								{data?.nickname
									? data?.firstName && data?.lastName
										? `${data.nickname} (${data.firstName} ${data.lastName})`
										: `${data.nickname}`
									: data?.email}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<DialogTrigger className="w-full">
									<div className="flex flex-row items-center">
										<SettingsIcon className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</div>
								</DialogTrigger>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => push("/team/settings")}>
									<Users className="mr-2 h-4 w-4" />
									<span>Team</span>
								</DropdownMenuItem>
								{invitations && invitations.length > 0 ? (
									<DropdownMenuSub>
										<DropdownMenuSubTrigger>
											<UserPlus className="mr-2 h-4 w-4" />
											<div className="flex flex-row gap-x-3">
												<span>Invitations</span>
												{invitations && invitations.length > 0 && (
													<p className="font-semibold">{invitations.length}</p>
												)}
											</div>
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent>
												{invitations &&
													invitations.map(item => (
														<DropdownMenuItem
															key={item.id}
															className="flex flex-row gap-x-3"
														>
															<Building
																className="bg-gradient-to-tr from-violet-500 to-blue-500 rounded-md p-1 border text-white"
																size={35}
															/>
															<p className="font-semibold truncate">
																{item.team?.name}
															</p>
															<div className="flex flex-row gap-x-1">
																<Check
																	size={20}
																	className="text-green-800 cursor-pointer transition-colors hover:text-green-500"
																	onClick={() => accept(item.id)}
																/>
																<X
																	size={20}
																	className="text-red-800 cursor-pointer transition-colors hover:text-red-500"
																	onClick={() => decline(item.id)}
																/>
															</div>
														</DropdownMenuItem>
													))}
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
								) : (
									<DropdownMenuItem onClick={() => push("/team-selection")}>
										<UserPlus className="mr-2 h-4 w-4" />
										<span>Invitations</span>
									</DropdownMenuItem>
								)}
								<DropdownMenuItem onClick={() => push("/team-selection")}>
									<Plus className="mr-2 h-4 w-4" />
									<span>New Team</span>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => mutate()}>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					{/*  */}
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Profile Settings</DialogTitle>
						</DialogHeader>
						<Settings />
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}
