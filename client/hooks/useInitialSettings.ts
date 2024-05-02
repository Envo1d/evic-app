import { useEffect } from 'react'
import { UseFormReset } from 'react-hook-form'

import { TypeUserForm } from '@/types/user.types'

import { useProfile } from './useProfile'

export function useInitialSettings(reset: UseFormReset<TypeUserForm>) {
	const { data, isSuccess } = useProfile()

	useEffect(() => {
		if (isSuccess && data)
			reset({
				email: data.user.email,
				firstName: data.user.firstName,
				lastName: data.user.lastName,
				nickname: data.user.nickname,
				breakInterval: data.user.breakInterval,
				intervalsCount: data.user.intervalsCount,
				workInterval: data.user.workInterval
			})
	}, [isSuccess])
}
