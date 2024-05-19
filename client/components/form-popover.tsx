"use client"

import { useAutoAnimate } from "@formkit/auto-animate/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"

import { IProjectCreateForm } from "@/types/project.types"

import { useCreateProject } from "@/hooks/projects"

import { FormPicker } from "./form-picker"
import api from "@/api"

interface IFormPopover {
	children: React.ReactNode
	side?: "left" | "right" | "top" | "bottom"
	align?: "start" | "center" | "end"
	sideOffset?: number
}

export function FormPopover({
	children,
	side = "bottom",
	align,
	sideOffset = 0
}: IFormPopover) {
	const [isOpen, setIsOpen] = useState(false)

	const form = useForm<IProjectCreateForm>({
		mode: "onChange",
		resolver: zodResolver(api.project.createValidationSchema),
		defaultValues: {
			name: "",
			imagePath: ""
		}
	})

	const { mutate, isPending } = useCreateProject()

	const onSubmit: SubmitHandler<IProjectCreateForm> = data => {
		mutate(data)
		form.reset()
		setIsOpen(false)
	}

	const [parent] = useAutoAnimate()

	return (
		<Popover
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				align={align}
				className="w-80 pt-3"
				side={side}
				sideOffset={sideOffset}
			>
				<div className="text-sm font-medium text-center text-neutral-600 pb-4">
					Create board
				</div>
				<PopoverClose asChild>
					<Button
						className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
						variant="ghost"
						size="sm"
						onClick={() => form.reset()}
					>
						<X className="h-4 w-4" />
					</Button>
				</PopoverClose>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="imagePath"
								render={({ field }) => (
									<FormItem ref={parent}>
										<FormControl>
											<FormPicker
												setPath={form.setValue}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem ref={parent}>
										<FormLabel className="text-sm font-medium">
											Board Title
										</FormLabel>
										<FormControl>
											<Input
												className="w-full rounded-xl p-4 bg-transparent"
												type="text"
												placeholder="Board Title"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								variant="primary"
								size="sm"
								className="w-full"
								disabled={isPending}
							>
								Create
							</Button>
						</div>
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	)
}
