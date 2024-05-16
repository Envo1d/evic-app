"use client"

import { useAutoAnimate } from "@formkit/auto-animate/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import { ElementRef, useRef, useState } from "react"
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
import { Input } from "@/components/ui/input"

import { ICreateListForm } from "@/types/project.types"

import { useCreateProjectList } from "@/hooks/projects"

import { ListWrapper } from "./list-wrapper"
import api from "@/api"

interface IListForm {
	projectId: string
}

export function ListForm({ projectId }: IListForm) {
	const [isEditing, setIsEditing] = useState(false)
	const formRef = useRef<ElementRef<"form">>(null)
	const inputRef = useRef<ElementRef<"input">>(null)

	const form = useForm<ICreateListForm>({
		mode: "onChange",
		resolver: zodResolver(api.project.listValidationSchema),
		defaultValues: {
			title: ""
		}
	})

	const { createList } = useCreateProjectList(projectId)

	const enableEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			inputRef.current?.focus()
		})
	}

	const disableEditing = () => {
		form.reset()
		setIsEditing(false)
	}

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			disableEditing()
		}
	}

	useEventListener("keydown", onKeyDown)
	useOnClickOutside(formRef, disableEditing)
	const [parent] = useAutoAnimate()

	const onSubmit: SubmitHandler<ICreateListForm> = data => {
		createList(data)
		disableEditing()
	}

	if (isEditing) {
		return (
			<ListWrapper>
				<Form {...form}>
					<form
						ref={formRef}
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormControl>
										<Input
											className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
											type="text"
											placeholder="Enter list title..."
											{...field}
											ref={inputRef}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-1">
							<Button
								type="submit"
								variant="primary"
								className="py-0.5 text-base"
							>
								Add list
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
			</ListWrapper>
		)
	}

	return (
		<ListWrapper>
			<button
				onClick={enableEditing}
				className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
			>
				<Plus className="h-4 w-4 mr-2" />
				Add a list
			</button>
		</ListWrapper>
	)
}
