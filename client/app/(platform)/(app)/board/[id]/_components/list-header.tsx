import { useAutoAnimate } from "@formkit/auto-animate/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ElementRef, useRef, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useEventListener } from "usehooks-ts"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
	IProjectListResponse,
	IUpdateListTitleForm
} from "@/types/project.types"

import { useUpdateProjectListTitle } from "@/hooks/projects"

import { ListOptions } from "./list-options"
import api from "@/api"

interface IListHeader {
	data: IProjectListResponse
	onAddCard: () => void
}

export function ListHeader({ data, onAddCard }: IListHeader) {
	const [isEditing, setIsEditing] = useState(false)
	const formRef = useRef<ElementRef<"form">>(null)
	const inputRef = useRef<ElementRef<"input">>(null)
	const form = useForm<IUpdateListTitleForm>({
		mode: "onChange",
		resolver: zodResolver(api.project.listValidationSchema),
		defaultValues: {
			title: data.title
		}
	})
	const { updateListTitle } = useUpdateProjectListTitle(data.projectId)

	const enableEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			inputRef.current?.focus()
			inputRef.current?.select()
		})
	}

	const disableEditing = () => {
		setIsEditing(false)
	}

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") formRef.current?.requestSubmit()
	}

	const onBlur = () => {
		formRef.current?.requestSubmit()
	}

	useEventListener("keydown", onKeyDown)
	const [parent] = useAutoAnimate()

	const onSubmit: SubmitHandler<IUpdateListTitleForm> = formData => {
		if (formData.title === data.title) return disableEditing()

		formData.listId = data.id
		updateListTitle(formData)
		disableEditing()
	}

	return (
		<div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
			{isEditing ? (
				<Form {...form}>
					<form
						className="flex-1 px-[2px]"
						ref={formRef}
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormControl>
										<Input
											className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
											type="text"
											placeholder="Enter list title..."
											{...field}
											ref={inputRef}
											onBlur={onBlur}
										/>
									</FormControl>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			) : (
				<div
					onClick={enableEditing}
					className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
				>
					{data.title}
				</div>
			)}
			<ListOptions
				onAddCard={onAddCard}
				data={data}
			/>
		</div>
	)
}
