export const errorCatch = (err: any): string => {
	const msg = err?.response?.data?.message

	return msg
		? typeof err.response.data.message === 'object'
			? msg[0]
			: msg
		: err.message
}
