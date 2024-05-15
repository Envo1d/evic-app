import { z } from "zod"

import type { IProfileResponse, IUser, TypeUserForm } from "@/types/user.types"

import HttpFactory from "../factory"

class UserModule extends HttpFactory {
	private URL = "/user"

	settingsValidationSchema = z.object({
		email: z
			.string()
			.min(1, { message: "Email is required" })
			.email({ message: "Invalid email" }),
		password: z.nullable(
			z.optional(z.string().min(6, { message: "Password too short" }))
		),
		nickname: z.nullable(
			z.optional(
				z.string().min(3, { message: "Nickname must be at least 3 chars" })
			)
		),
		firstName: z.nullable(
			z.optional(
				z.string().min(3, { message: "First name must be at least 3 chars" })
			)
		),
		lastName: z.nullable(
			z.optional(
				z.string().min(3, { message: "Last name must be at least 3 chars" })
			)
		),
		breakInterval: z.optional(
			z.number().min(1, { message: "Min interval must be at least 1" })
		),
		workInterval: z.optional(
			z.number().min(1, { message: "Min interval must be at least 1" })
		),
		intervalsCount: z.optional(
			z
				.number()
				.min(1, { message: "Min intervals must be at least 1" })
				.max(10, { message: "Max intervals is 10" })
		)
	})

	async getProfile(): Promise<IProfileResponse> {
		const res = await this.call<IProfileResponse>("GET", `${this.URL}/profile`)

		return res
	}

	async update(data: TypeUserForm) {
		const res = await this.call<IUser>("PUT", `${this.URL}/update`, data)

		return res
	}
}

export default UserModule
