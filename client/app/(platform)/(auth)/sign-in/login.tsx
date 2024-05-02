"use client"

import { useAutoAnimate } from "@formkit/auto-animate/react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

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

import { IAuthForm } from "@/types/auth.types"

import { DASHBOARD_PAGES } from "@/config/pages-url.config"

import api from "@/api"

export function Login() {
	const form = useForm<IAuthForm>({
		mode: "onChange",
		resolver: valibotResolver(api.auth.validationSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	})

	const [parent] = useAutoAnimate()

	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ["auth"],
		mutationFn: (data: IAuthForm) => api.auth.main("login", data),
		onSuccess() {
			toast.success("Successfully login!")
			form.reset()
			push(DASHBOARD_PAGES.HOME)
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}

	return (
		<Form {...form}>
			<form
				className="bg-white shadow-xl rounded-3xl w-full lg:w-2/4 border border-slate-300 px-10 py-20"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<h1 className="text-5xl font-semibold">Sign In</h1>
				<div className="mt-5 flex flex-col gap-5">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem ref={parent}>
								<FormLabel className="text-lg font-medium">Email</FormLabel>
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
						name="password"
						render={({ field }) => (
							<FormItem ref={parent}>
								<FormLabel className="text-lg font-medium">Password</FormLabel>
								<FormControl>
									<Input
										className="w-full rounded-xl p-4 bg-transparent"
										type="password"
										placeholder="Password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col items-center gap-5 justify-center mt-10">
					<Button
						type="submit"
						size="sm"
						className="text-base p-5"
					>
						Submit
					</Button>
					<div className="flex flex-row">
						<small className="mr-3 text-sm mt-2.5">
							Don't have an account?
						</small>
						<Button
							variant="ghost"
							size="sm"
							className="mt-0.5 text-primary"
							onClick={() => push("/sign-up")}
						>
							Sign up!
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
