import Cookies from 'js-cookie'

enum EnumToken {
	'ACCESS_TOKEN' = 'accessToken',
	'REFRESH_TOKEN' = 'refreshToken',
}

class TokenModule {
	getAccessToken = () => {
		const accessToken = Cookies.get(EnumToken.ACCESS_TOKEN)
		return accessToken || null
	}

	saveTokenStorage = (accessToken: string) => {
		Cookies.set(EnumToken.ACCESS_TOKEN, accessToken, {
			domain: 'localhost',
			sameSite: 'Strict',
			expires: 1,
		})
	}

	removeFromStorage = () => {
		Cookies.remove(EnumToken.ACCESS_TOKEN)
	}
}

export default TokenModule