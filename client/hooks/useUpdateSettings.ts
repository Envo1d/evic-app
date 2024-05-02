import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TypeUserForm } from '@/types/user.types'

import api from '@/api'

export function useUpdateSettings() {
	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		mutationKey: ['update profile'],
		mutationFn: (data: TypeUserForm) => api.user.update(data),
		onSuccess() {
			toast.success('Successfully update profile!')
			queryClient.invalidateQueries({ queryKey: ['profile'] })
		}
	})

	return { mutate, isPending }
}
