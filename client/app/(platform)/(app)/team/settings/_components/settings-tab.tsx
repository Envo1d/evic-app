import { useAutoAnimate } from "@formkit/auto-animate/react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Building } from "lucide-react"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { useAppStore } from "@/providers/store-provider"

import { ITeamCreateForm } from "@/types/team.types"

import { useTeam } from "@/hooks/teams"
import { useProfile } from "@/hooks/useProfile"

import { DeleteAlert } from "./delete-alert"
import { LeaveAlert } from "./leave-alert"
import api from "@/api"

export function SettingsTab() {
	const { data: team } = useTeam()
	const { data: profile } = useProfile()
	const { activeTeamId } = useAppStore(state => state)

	const form = useForm<ITeamCreateForm>({
		mode: "onChange",
		resolver: valibotResolver(api.team.createTeamValidationSchema),
		defaultValues: {
			name: ""
		}
	})

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationKey: ["update team"],
		mutationFn: (data: ITeamCreateForm) =>
			api.team.updateTeam(activeTeamId, data),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ["team"]
			})
			queryClient.invalidateQueries({
				queryKey: ["teams"]
			})
			setIsOpen(false)
			toast.success(`Team name updated!`)
		}
	})

	const onSubmit: SubmitHandler<ITeamCreateForm> = data => {
		mutate(data)
	}

	const [parent] = useAutoAnimate()

	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		form.reset()
	}, [isOpen, form.reset])

	return (
		<section className="flex flex-col gap-y-32">
			<div>
				<h1 className="text-lg font-semibold">Team profile</h1>
				<Separator className="mb-5" />
				<div className="ml-5">
					<Dialog
						open={isOpen}
						onOpenChange={setIsOpen}
					>
						<DialogTrigger>
							<div className="flex flex-row gap-1 items-center w-full">
								<Building
									className="bg-gradient-to-tr from-violet-500 to-blue-500 rounded-md p-1 border text-white"
									size={50}
								/>
								<p className="font-semibold truncate ml-3">{team?.name}</p>
							</div>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<DialogHeader className="mb-5">
										<DialogTitle>Edit team name</DialogTitle>
										<DialogDescription>
											Make changes to your team here. Click save when you're
											done.
										</DialogDescription>
									</DialogHeader>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem ref={parent}>
												<FormLabel className="text-md font-medium">
													Team name
												</FormLabel>
												<FormControl>
													<Input
														className="w-full rounded-xl p-4 bg-transparent"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<DialogFooter>
										<Button
											size="sm"
											type="submit"
										>
											Save changes
										</Button>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<div>
				<h1 className="text-lg font-semibold">Danger</h1>
				<Separator className="mb-5" />

				{team?.creatorId === profile?.id ? <DeleteAlert /> : <LeaveAlert />}
			</div>
		</section>
	)
}
