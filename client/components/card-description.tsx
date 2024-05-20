"use client"

import { useAutoAnimate } from "@formkit/auto-animate/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlignLeft } from "lucide-react"
import { ElementRef, useRef, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useEventListener, useOnClickOutside } from "usehooks-ts"

import { ITaskResponse, IUpdateTaskDescription } from "@/types/task.types"

import { useUpdateTaskDescription } from "@/hooks/tasks"

import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Skeleton } from "./ui/skeleton"
import { Textarea } from "./ui/textarea"
import api from "@/api"

interface ICardDescription {
	task: ITaskResponse
}

export function CardDescription({ task }: ICardDescription) {
	const form = useForm<IUpdateTaskDescription>({
		mode: "onChange",
		defaultValues: {
			description: task.description
		},
		resolver: zodResolver(api.task.updateDescriptionSchema)
	})
	const [parent] = useAutoAnimate()
	const { updateTaskDescription } = useUpdateTaskDescription(
		task.list?.projectId,
		task.id
	)
	const [isEditing, setIsEditing] = useState(false)
	const textareaRef = useRef<ElementRef<"textarea">>(null)
	const formRef = useRef<ElementRef<"form">>(null)

	const onSubmit: SubmitHandler<IUpdateTaskDescription> = data => {
		data.listId = task.listId
		data.taskId = task.id
		updateTaskDescription(data)
		disableEditing()
	}

	const enableEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			textareaRef.current?.focus()
		})
	}

	const disableEditing = () => {
		setIsEditing(false)
		form.reset()
	}

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			disableEditing()
		}
	}

	useEventListener("keydown", onKeyDown)
	useOnClickOutside(formRef, disableEditing)

	return (
		<div className="flex items-start gap-x-3 w-full">
			<AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
			<div className="w-full">
				<p className="font-semibold text-neutral-700 mb-2">Description</p>
				{isEditing ? (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							ref={formRef}
							className="space-y-2"
						>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem ref={parent}>
										<FormControl>
											<Textarea
												className="w-full mt-2"
												placeholder="Add a more detailed description"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex items-center gap-x-2">
								<Button
									type="submit"
									variant="primary"
									size="sm"
								>
									Save
								</Button>
								<Button
									type="button"
									onClick={disableEditing}
									size="sm"
									variant="ghost"
								>
									Cancel
								</Button>
							</div>
						</form>
					</Form>
				) : (
					<div
						onClick={enableEditing}
						role="button"
						className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
					>
						{task.description || "Add a more detailed description..."}
					</div>
				)}
			</div>
		</div>
	)
}

CardDescription.Skeleton = function DescriptionSkeleton() {
	return (
		<div className="flex items-start gap-x-3 w-full">
			<Skeleton className="h-6 w-6 bg-neutral-200" />
			<div className="w-full">
				<Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
				<Skeleton className="w-full h-[78px] bg-neutral-200" />
			</div>
		</div>
	)
}
