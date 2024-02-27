import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { createNamespace, getNamespace } from 'cls-hooked';
import { NextFunction, Request, Response } from 'express';
import {
  TOGETHER_ENTITY_MANAGER,
  TOGETHER_NAMESPACE,
} from 'src/common/constant/nameSpace';
import { EntityManager } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(
    private readonly em: EntityManager,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(_req: Request, _res: Response, next: NextFunction) {
    const namespace =
      getNamespace(TOGETHER_NAMESPACE) ?? createNamespace(TOGETHER_NAMESPACE);
    this.logger.log(`Hit TransactionMiddleware`);

    return namespace.runAndReturn(async () => {
      this.logger.log(
        `TOGETHER_NAMESPACE Run with status: ${!!namespace.active}`,
      );
      Promise.resolve()
        .then(() => {
          try {
            this.setEntityManager();
          } catch (error) {
            throw error;
          }
        })
        .then(next);
    });
  }

  private setEntityManager() {
    const namespace = getNamespace(TOGETHER_NAMESPACE)!;
    namespace.set(TOGETHER_ENTITY_MANAGER, this.em);
  }
}
