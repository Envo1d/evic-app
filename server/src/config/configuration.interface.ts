export type TypeCookieSameSite = boolean | 'none' | 'strict' | 'lax'

export interface AppConfig {
	port: number
	node_env: string
	secure: boolean
	domain: string
	cookie_same_site: TypeCookieSameSite
	logs_path: string
}

export interface AuthConfig {
	jwt_secret: string
	access_token_name: string
	access_token_lifetime: string
	refresh_token_name: string
	refresh_token_lifetime: string
}

export interface CorsConfig {
	origin: string
	credentials: boolean
}

export interface DatabaseConfig {
	url: string
	host: string
	port: number
	user: string
	password: string
	db: string
}
