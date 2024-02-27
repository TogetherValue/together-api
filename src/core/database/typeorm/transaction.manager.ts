import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import {
  TOGETHER_ENTITY_MANAGER,
  TOGETHER_NAMESPACE,
} from 'src/common/constant/nameSpace';
import { EntityManager } from 'typeorm';

@Injectable()
export class TransactionManager {
  getEntityManager(): EntityManager {
    const nameSpace = getNamespace(TOGETHER_NAMESPACE);
    if (!nameSpace || !nameSpace.active)
      throw new InternalServerErrorException(
        `${TOGETHER_NAMESPACE} is not active`,
      );
    return nameSpace.get(TOGETHER_ENTITY_MANAGER);
  }
}
