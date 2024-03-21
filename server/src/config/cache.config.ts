import { CacheModuleOptions } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
import { RedisConfig } from './configuration.interface'

export const getCacheConfig = async (
	config: ConfigService
): Promise<CacheModuleOptions> => ({
	isGlobal: true,
	store: redisStore,
	host: config.get<RedisConfig>('redis').host,
	port: config.get<RedisConfig>('redis').port,
	password: config.get<RedisConfig>('redis').password
})
