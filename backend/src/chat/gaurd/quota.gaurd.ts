import { InjectRedis } from '@nestjs-modules/ioredis';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import Redis from 'ioredis';

export class QuotaGuard {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.body.sessionId;

    const USER_KEY = `quota:user:${sessionId}`;
    const USER_LIMIT = 20; // max 20 requests
    const TTL_SECONDS = 60 * 60 * 24; // 24 hours

    const script = `
  local current = redis.call("GET", KEYS[1])

  if not current then
    redis.call("SET", KEYS[1], 1, "EX", ARGV[2])
    return 1
  end

  if tonumber(current) >= tonumber(ARGV[1]) then
    return -1
  end

  return redis.call("INCR", KEYS[1])
`;

    const result = await this.redis.eval(
      script,
      1,
      USER_KEY,
      USER_LIMIT,
      TTL_SECONDS,
    );

    if (result === -1) {
      console.log(await this.redis.lrange(`chat:${sessionId}`, 0, -1));
      throw new HttpException(
        'Your quota has been exceeded. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
