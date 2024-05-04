import { useEffect } from "react"
import { UseFormReset } from "react-hook-form"

import { TypeUserForm } from "@/types/user.types"

import { useProfile } from "./useProfile"

export function useInitialSettings(reset: UseFormReset<TypeUserForm>) {
	const { data, isSuccess } = useProfile()

	useEffect(() => {
		if (isSuccess && data)
			reset({
				email: data.email,
				firstName: data.firstName,
				lastName: data.lastName,
				nickname: data.nickname,
				breakInterval: data.breakInterval,
				intervalsCount: data.intervalsCount,
				workInterval: data.workInterval
			})
	}, [isSuccess])
}
