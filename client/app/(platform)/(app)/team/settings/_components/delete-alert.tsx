"use client"

import { useMutation } from "@tanstack/react-query"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { FetchError } from "ofetch"
import { toast } from "sonner"

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

import api from "@/api"

export function DeleteAlert() {
	const { push } = useRouter()

	const submit = () => {
		mutate()
	}

	const { mutate } = useMutation({
		mutationKey: ["delete team"],
		mutationFn: () => api.team.deleteTeam(),
		onSuccess() {
			push("/team-selection")
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
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
					<p className="ml-1.5">delete team</p>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this team
						and remove all data from our servers.
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
