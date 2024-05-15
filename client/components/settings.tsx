import { useAutoAnimate } from "@formkit/auto-animate/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"

import { TypeUserForm } from "@/types/user.types"

import { useInitialSettings } from "@/hooks/useInitialSettings"
import { useUpdateSettings } from "@/hooks/useUpdateSettings"

import { Button } from "./ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "./ui/form"
import { Input } from "./ui/input"
import api from "@/api"

export function Settings() {
	const [parent] = useAutoAnimate()

	const form = useForm<TypeUserForm>({
		mode: "onChange",
		resolver: zodResolver(api.user.settingsValidationSchema)
	})

	useInitialSettings(form.reset)

	const { mutate, isPending } = useUpdateSettings()

	const onSubmit: SubmitHandler<TypeUserForm> = data => {
		const { password, ...rest } = data

		mutate({
			...rest,
			password: data.password || undefined
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid grid-cols-2 gap-10">
					<div className="flex flex-col gap-y-2">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel className="font-medium">Email</FormLabel>
									<FormControl>
										<Input
											className="w-full rounded-xl p-4 bg-transparent"
											type="email"
											placeholder="Email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="nickname"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel className="font-medium">Nickname</FormLabel>
									<FormControl>
										<Input
											className="w-full rounded-xl p-4 bg-transparent"
											type="text"
											placeholder="Nickname"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel className="font-medium">First Name</FormLabel>
									<FormControl>
										<Input
											className="w-full rounded-xl p-4 bg-transparent"
											type="text"
											placeholder="First Name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel className="font-medium">Last Name</FormLabel>
									<FormControl>
										<Input
											className="w-full rounded-xl p-4 bg-transparent"
											type="text"
											placeholder="Last Name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel className="font-medium">Password</FormLabel>
									<FormControl>
										<Input
											className="w-full rounded-xl p-4 bg-transparent"
											type="text"
											placeholder="Password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div>
						<FormField
							control={form.control}
							name="workInterval"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel className="font-medium">
										Work Interval (min.)
									</FormLabel>
									<FormControl>
										<Input
											className="w-full rounded-xl p-4 bg-transparent"
											type="number"
											placeholder="Work Interval (min.)"
											{...field}
											onChange={e => {
												if (e.target.value === "")
													return field.onChange(undefined)
												field.onChange(Number(e.target.value))
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="breakInterval"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel className="font-medium">
										Break Interval (min.)
									</FormLabel>
									<FormControl>
										<Input
											className="w-full rounded-xl p-4 bg-transparent"
											type="number"
											placeholder="Break Interval (min.)"
											{...field}
											onChange={e => {
												if (e.target.value === "")
													return field.onChange(undefined)
												field.onChange(Number(e.target.value))
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="intervalsCount"
							render={({ field }) => (
								<FormItem ref={parent}>
									<FormLabel className="font-medium">
										Intervals Count (max 10)
									</FormLabel>
									<FormControl>
										<Input
											className="w-full rounded-xl p-4 bg-transparent"
											type="number"
											placeholder="Intervals Count (max 10)"
											{...field}
											onChange={e => {
												if (e.target.value === "")
													return field.onChange(undefined)
												field.onChange(Number(e.target.value))
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Button
					type="submit"
					disabled={isPending}
					variant="primary"
					size="sm"
					className="mt-8 w-full"
				>
					Save
				</Button>
			</form>
		</Form>
	)
}
