"use client"

import { useAutoAnimate } from "@formkit/auto-animate/react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { TeamCard } from "@/components/team-card"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useAppStore } from "@/providers/store-provider"

import { ITeamCreateForm, ITeamCreateRoleForm } from "@/types/team.types"

import { useTeamList } from "@/hooks/teams/useTeamList"

import api from "@/api"

export function TeamSelection() {
	const { setActiveTeamId } = useAppStore(state => state)

	const { data: teams } = useTeamList()

	const [isTeamSelection, setIsTeamSelection] = useState<boolean>(true)

	const form = useForm<ITeamCreateRoleForm>({
		mode: "onChange",
		resolver: valibotResolver(api.team.createTeamValidationSchema),
		defaultValues: {
			name: ""
		}
	})

	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ["create team"],
		mutationFn: (data: ITeamCreateForm) => api.team.createTeam(data),
		onSuccess(res) {
			toast.success(`Team "${res.name}" created!`)
			setActiveTeamId(res.id)
			push("/app")
		}
	})

	const onSubmit: SubmitHandler<ITeamCreateRoleForm> = data => {
		mutate(data)
	}

	const changeState = (val: boolean) => {
		form.reset()
		setIsTeamSelection(val)
	}

	const [parent] = useAutoAnimate()

	return (
		<Card className="w-[350px] cursor-default">
			<CardHeader>
				<CardTitle>{isTeamSelection ? "Select" : "Create"} team</CardTitle>
				<CardDescription>to continue Evic</CardDescription>
			</CardHeader>
			<CardContent>
				{isTeamSelection ? (
					teams &&
					(teams?.createdByUser.length > 0 || teams?.member.length > 0) ? (
						<ScrollArea className="flex flex-col gap-2 h-56 w-full p-5 rounded-md border">
							{teams.createdByUser.map(team => (
								<TeamCard
									key={team.id}
									name={team.name}
									id={team.id}
								/>
							))}
							{teams.member.map(team => (
								<TeamCard
									key={team.id}
									name={team.name}
									id={team.id}
								/>
							))}
						</ScrollArea>
					) : (
						<p>No teams</p>
					)
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem ref={parent}>
										<FormLabel className="text-lg font-medium">
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
							<div className="flex flex-row justify-between mt-6">
								<Button
									variant="outline"
									size="sm"
									onClick={() => changeState(true)}
								>
									CANCEL
								</Button>
								<Button
									size="sm"
									className="font-semibold transition-all hover:-translate-y-1 w-1/2"
									variant="primary"
									type="submit"
								>
									CREATE TEAM
								</Button>
							</div>
						</form>
					</Form>
				)}
				{isTeamSelection && (
					<div className="flex my-6 items-center justify-between">
						<div className="h-[0.115rem] bg-slate-400 opacity-50 w-1/2" />
						<p className="text-sm font-semibold w-1/6 opacity-80 text-center">
							or
						</p>
						<div className="h-[0.115rem] bg-slate-400 opacity-50 w-1/2 " />
					</div>
				)}
				{isTeamSelection && (
					<Button
						size="sm"
						className="font-semibold transition-all hover:-translate-y-1 w-full"
						variant="outline"
						onClick={() => changeState(false)}
					>
						CREATE TEAM
					</Button>
				)}
			</CardContent>
		</Card>
	)
}
