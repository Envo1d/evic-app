export default function useApiUrl() {
	const config = useRuntimeConfig()
	return config.public.apiUrl
}
