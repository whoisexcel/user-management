import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimiter from '../rate-limiter';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await rateLimiter.consume(req.ip);
      next();
    } catch (rejRes) {
      res.status(429).send('Too Many Requests');
    }
  }
}
