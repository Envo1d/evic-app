import { RedisModuleOptions } from '@nestjs-modules/ioredis'
import { ConfigService } from '@nestjs/config'
import { RedisConfig } from './configuration.interface'

export const getRedisConfig = async (
	config: ConfigService
): Promise<RedisModuleOptions> => ({
	type: 'single',
	options: {
		host: config.get<RedisConfig>('redis').host,
		password: config.get<RedisConfig>('redis').password,
		port: config.get<RedisConfig>('redis').port
	}
})
