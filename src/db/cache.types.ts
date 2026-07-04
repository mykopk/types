import type { RedisSetOptions } from './redis.types';

export interface CacheEntry<T> {
  data: T;
  createdAt: number;
  ttl?: number;
}

export type CacheStrategy = 'cache-aside' | 'write-through' | 'write-behind';

export interface CacheConfig {
  defaultTtl: number;
  namespace?: string;
  keyPrefix?: string;
  strategy?: CacheStrategy;
}

export interface CacheOperationOptions {
  ttl?: number;
  namespace?: string;
  skipCache?: boolean;
}

export interface CacheGetOptions extends CacheOperationOptions {
  refreshTtl?: boolean;
}

export interface CacheSetOptions extends CacheOperationOptions, RedisSetOptions {}

export interface CacheHealthStatus {
  isHealthy: boolean;
  totalKeys?: number;
  responseTime?: number;
}
