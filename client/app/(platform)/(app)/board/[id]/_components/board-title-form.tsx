import { useAutoAnimate } from "@formkit/auto-animate/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"
import { ElementRef, useRef, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { IProjectUpdateForm } from "@/types/project.types"

import { useGetActiveTeam } from "@/hooks/teams"

import api from "@/api"

interface IBoardTitleForm {
	title: string
	id: string
}

export function BoardTitleForm({ title, id }: IBoardTitleForm) {
	const [isEditing, setIsEditing] = useState(false)
	const inputRef = useRef<ElementRef<"input">>(null)
	const formRef = useRef<ElementRef<"form">>(null)
	const { data: activeTeam } = useGetActiveTeam()
	const queryClient = useQueryClient()
	const form = useForm<IProjectUpdateForm>({
		mode: "onChange",
		resolver: zodResolver(api.project.updateValidationSchema),
		defaultValues: {
			name: title
		}
	})
	const [parent] = useAutoAnimate()

	const enableEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			inputRef?.current?.focus()
			inputRef?.current?.click()
		})
	}

	const disableEditing = () => setIsEditing(false)

	const { mutate } = useMutation({
		mutationKey: ["update project name"],
		mutationFn: (name: string) =>
			api.project.updateProject(id, {
				name
			}),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["project", id] })
			toast.success("Project name updated")
			disableEditing()
		},
		onError(err) {
			if (err instanceof FetchError) toast.error(err.data.message)
		}
	})

	const onSubmit: SubmitHandler<IProjectUpdateForm> = data => {
		mutate(data.name)
	}

	const onBlur = () => {
		formRef.current?.requestSubmit()
	}

	if (isEditing) {
		return (
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex items-center gap-x-2"
					ref={formRef}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem ref={parent}>
								<FormControl>
									<Input
										className="text-white text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0 border-none"
										type="text"
										{...field}
										onBlur={onBlur}
									/>
								</FormControl>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		)
	}

	return (
		<Button
			onClick={enableEditing}
			className="font-bold text-lg h-auto w-auto p-1 px-2"
			variant="transparent"
		>
			{title}
		</Button>
	)
}
