import { useQuery } from '@tanstack/react-query'

import api from '@/api'

export function useProfile() {
	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['profile'],
		queryFn: () => api.user.getProfile()
	})

	return { data, isLoading, isSuccess }
}
