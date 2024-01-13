import { env } from '@/env';
import { Logger } from 'next-axiom';
import { LogLevel } from 'next-axiom/dist/logger';

export function getLogger(): Logger {
  const logLevel =
    env.NODE_ENV === 'production' ? LogLevel.info : LogLevel.debug;
  return new Logger({ logLevel });
}
