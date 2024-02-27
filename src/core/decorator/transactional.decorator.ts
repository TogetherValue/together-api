import { InternalServerErrorException } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import {
  TOGETHER_ENTITY_MANAGER,
  TOGETHER_NAMESPACE,
} from 'src/common/constant/nameSpace';
import { EntityManager } from 'typeorm';

export function Transactional() {
  return function (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    // save original method
    const originMethod = descriptor.value;

    // wrapped origin method with Transaction
    async function transactionWrapped(...args: unknown[]) {
      // validate nameSpace && get nameSpace
      const nameSpace = getNamespace(TOGETHER_NAMESPACE);
      if (!nameSpace || !nameSpace.active)
        throw new InternalServerErrorException(
          `${TOGETHER_NAMESPACE} is not active`,
        );

      // get EntityManager
      const em = nameSpace.get(TOGETHER_ENTITY_MANAGER) as EntityManager;
      if (!em)
        throw new InternalServerErrorException(
          `Could not find EntityManager in ${TOGETHER_NAMESPACE} nameSpace`,
        );

      return await em.transaction(
        process.env.NODE_ENV !== 'test' ? 'REPEATABLE READ' : 'SERIALIZABLE',
        async (tx: EntityManager) => {
          nameSpace.set(TOGETHER_ENTITY_MANAGER, tx);
          return await originMethod.apply(this, args);
        },
      );
    }

    descriptor.value = transactionWrapped;
  };
}
