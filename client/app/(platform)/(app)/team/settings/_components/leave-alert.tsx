"use client"

import { useMutation } from "@tanstack/react-query"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { useGetActiveTeam } from "@/hooks/teams"

import api from "@/api"

export function LeaveAlert() {
	const { push } = useRouter()
	const { data } = useGetActiveTeam()

	const submit = () => {
		mutate()
	}

	const { mutate } = useMutation({
		mutationKey: ["leave team"],
		mutationFn: () =>
			api.team.leaveTeam({
				memberId: data?.activeTeamMemberId!
			}),
		onSuccess() {
			push("/team-selection")
		}
	})

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					className="border-red-700 text-red-700 uppercase px-7 transition-colors hover:bg-red-500 hover:bg-opacity-5 hover:border-red-500 hover:text-red-500"
				>
					<X size={18} />
					<p className="ml-1.5">leave team</p>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. You will permanently leave this team.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={submit}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
