export const configuration = () => ({
	app: {
		port: parseInt(process.env.PORT, 10) || 7000,
		node_env: process.env.NODE_ENV,
		secure: Boolean(JSON.parse(process.env.SECURE)),
		domain: process.env.DOMAIN,
		cookie_same_site: process.env.COOKIE_SAME_SITE,
		logs_path: process.env.LOGS_PATH
	},
	auth: {
		jwt_secret: process.env.JWT_SECRET,
		access_token_name: process.env.ACCESS_TOKEN_NAME,
		refresh_token_name: process.env.REFRESH_TOKEN_NAME,
		access_token_lifetime: process.env.ACCESS_TOKEN_LIFETIME,
		refresh_token_lifetime: process.env.REFRESH_TOKEN_LIFETIME
	},
	database: {
		url: process.env.DATABASE_URL,
		host: process.env.POSTGRES_HOST,
		port: parseInt(process.env.POSTGRES_PORT, 10),
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		db: process.env.POSTGRES_DB
	},
	cors: {
		origin: process.env.ORIGIN,
		credentials: Boolean(JSON.parse(process.env.CREDENTIALS))
	}
})
