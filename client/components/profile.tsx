"use client"

import {
	DropdownMenu,
	DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import { LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut
} from "@/components/ui/dropdown-menu"

import { useProfile } from "@/hooks/useProfile"

import api from "@/api"

export function Profile() {
	const router = useRouter()

	const { data, isLoading } = useProfile()

	const { mutate } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => api.auth.logout(),
		onSuccess: () => router.push("/sign-in")
	})

	return (
		<div>
			<div className="flex items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar className="cursor-pointer">
							<AvatarImage src="/default" />
							<AvatarFallback className="bg-violet-500 hover:bg-violet-900 transition-colors text-white font-medium text-xl capitalize">
								{data?.nickname?.charAt(0) ||
									data?.firstName?.charAt(0) ||
									data?.email.charAt(0)}
							</AvatarFallback>
						</Avatar>
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
						<DropdownMenuItem onClick={() => router.push("/app/settings")}>
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => mutate()}>
							<LogOut className="mr-2 h-4 w-4" />
							<span>Log out</span>
							<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}
