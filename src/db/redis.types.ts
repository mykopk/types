export type RedisClientType = 'upstash' | 'ioredis';

export interface RedisConfig {
  url: string;
  token?: string;
  type: RedisClientType;
  maxRetriesPerRequest?: number;
  serviceName?: string;
}

export interface RedisSetOptions {
  ex?: number;
  px?: number;
  nx?: boolean;
  xx?: boolean;
}

export interface RedisHealthStatus {
  isHealthy: boolean;
  responseTime?: number;
  clientType: RedisClientType;
  details?: Record<string, unknown>;
}

export interface RedisResult<T> {
  success: boolean;
  value?: T | null;
  error?: Error | null;
}

export interface RedisKeyInfo {
  key: string;
  ttl?: number;
  namespace?: string;
}

export interface RedisNamespaceConfig {
  prefix: string;
  separator?: string;
}

export interface RedisScanOptions {
  pattern: string;
  count?: number;
}
