import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TogetherConfigService } from '../config/config.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly env: string;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: TogetherConfigService,
  ) {
    const appConfig = this.configService.getAppConfig();
    this.env = appConfig.ENV;
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, path } = request;
    const userAgent = request.get('user-agent') || '';

    this.logger.http(
      `REQUEST [${method} ${originalUrl}] ${ip} ${userAgent} has been excuted`,
    );

    next();
  }
}
