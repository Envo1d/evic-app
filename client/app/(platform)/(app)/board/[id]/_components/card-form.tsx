"use client"

import { useAutoAnimate } from "@formkit/auto-animate/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import {
	ElementRef,
	KeyboardEventHandler,
	forwardRef,
	useEffect,
	useRef
} from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useEventListener, useOnClickOutside } from "usehooks-ts"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { ICreateTask } from "@/types/task.types"

import { useCreateTask } from "@/hooks/tasks"

import api from "@/api"

interface ICardForm {
	listId: string
	projectId: string
	isEditing: boolean
	enableEditing: () => void
	disableEditing: () => void
}

export const CardForm = forwardRef<HTMLTextAreaElement, ICardForm>(
	({ listId, projectId, isEditing, enableEditing, disableEditing }, ref) => {
		const form = useForm<ICreateTask>({
			mode: "onChange",
			resolver: zodResolver(api.task.createValidationSchema),
			defaultValues: {
				name: ""
			}
		})
		const { createTask } = useCreateTask(projectId)
		const [parent] = useAutoAnimate()
		const formRef = useRef<ElementRef<"form">>(null)

		const onSubmit: SubmitHandler<ICreateTask> = data => {
			data.listId = listId
			createTask(data)
			disableEditing()
		}

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				disableEditing()
			}
		}

		useOnClickOutside(formRef, disableEditing)
		useEventListener("keydown", onKeyDown)

		const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = e => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault()
				formRef.current?.requestSubmit()
			}
		}

		useEffect(() => {
			if (!isEditing) form.reset()
		}, [isEditing])

		if (isEditing) {
			return (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="m-1 py-0.5 px-1 space-y-4"
						ref={formRef}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormControl>
										<Textarea
											className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
											placeholder="Enter a title for this card..."
											onKeyDown={onTextAreaKeyDown}
											{...field}
											ref={ref}
										/>
									</FormControl>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-1">
							<Button
								type="submit"
								variant="primary"
							>
								Add card
							</Button>
							<Button
								onClick={disableEditing}
								size="sm"
								variant="ghost"
							>
								<X className="h-5 w-5" />
							</Button>
						</div>
					</form>
				</Form>
			)
		}

		return (
			<div className="pt-2 px-2">
				<Button
					onClick={enableEditing}
					className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
					size="sm"
					variant="ghost"
				>
					<Plus className="h-4 w-4 mr-2" />
					Add a card
				</Button>
			</div>
		)
	}
)

CardForm.displayName = "CardForm"
