import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import requestIp from 'request-ip';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  constructor() {}

  use(request: Request, _response: Response, next: NextFunction): void {
    const clientIp = requestIp.getClientIp(request);
    request.clientIp = clientIp;

    next();
  }
}
