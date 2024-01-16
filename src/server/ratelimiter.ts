import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '@/env';

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});
const cache = new Map();

export const ratelimit = {
  // allows 1 request per 1 minute
  createRecipe: new Ratelimit({
    redis,
    analytics: true,
    ephemeralCache: cache,
    prefix: 'ratelimit:createRecipe',
    limiter: Ratelimit.slidingWindow(1, '1m'),
  }),
  // allows 8 request per 1 minute
  editRecipe: new Ratelimit({
    redis,
    analytics: true,
    ephemeralCache: cache,
    prefix: 'ratelimit:editRecipe',
    limiter: Ratelimit.slidingWindow(8, '1m'),
  }),
};

export function allowOnlyInProduction() {
  return env.NODE_ENV === 'production';
}
