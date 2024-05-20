import { useAutoAnimate } from "@formkit/auto-animate/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Layout } from "lucide-react"
import { ElementRef, useRef } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import { ITaskResponse, IUpdateTaskName } from "@/types/task.types"

import { useUpdateTaskTitle } from "@/hooks/tasks/useUpdateTaskTitle"

import api from "@/api"

interface ICardHeader {
	task: ITaskResponse
}

export function CardHeader({ task }: ICardHeader) {
	const form = useForm<IUpdateTaskName>({
		mode: "onChange",
		defaultValues: {
			name: task.name
		},
		resolver: zodResolver(api.task.createValidationSchema)
	})
	const [parent] = useAutoAnimate()
	const inputRef = useRef<ElementRef<"input">>(null)

	const { updateTaskTitle } = useUpdateTaskTitle(task.list?.projectId, task.id)

	const onSubmit: SubmitHandler<IUpdateTaskName> = data => {
		if (data.name === task.name) return

		data.listId = task.listId
		data.taskId = task.id
		updateTaskTitle(data)
	}

	const onBlur = () => {
		inputRef.current?.form?.requestSubmit()
	}

	return (
		<div className="flex items-start gap-x-3 mb-6 w-full">
			<Layout className="h-5 w-5 mt-2.5 text-neutral-700" />
			<div className="w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormControl>
										<Input
											className="fort-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
											{...field}
											ref={inputRef}
											onBlur={onBlur}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<p className="text-sm text-muted-foreground">
					in list <span className="underline">{task.list?.title}</span>
				</p>
			</div>
		</div>
	)
}

CardHeader.Skeleton = function HeaderSkeleton() {
	return (
		<div className="flex items-center gap-x-3 mb-6">
			<Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
			<div>
				<Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
				<Skeleton className="w-12 h-4 bg-neutral-200" />
			</div>
		</div>
	)
}
