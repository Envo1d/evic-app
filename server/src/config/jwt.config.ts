import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'
import { AuthConfig } from './configuration.interface'

export const getJwtConfig = async (
	config: ConfigService
): Promise<JwtModuleOptions> => ({
	secret: config.get<AuthConfig>('auth').jwt_secret
})
