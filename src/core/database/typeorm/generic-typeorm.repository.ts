import { BadRequestException, Injectable } from '@nestjs/common';
import {
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { TransactionManager } from './transaction.manager';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { RootEntity } from './root.entity';
import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { PaginationBuilder } from 'src/common/pagination/pagination.builder';

@Injectable()
export abstract class GenericTypeOrmRepository<T extends RootEntity> {
  protected abstract readonly txManager: TransactionManager;

  constructor(private readonly classType: ClassConstructor<T>) {}

  abstract getName(): EntityTarget<T>;

  async paginate(
    pagination: PaginationRequest,
    findManyOption?: FindManyOptions<T>,
  ) {
    const { take, page } = pagination;
    const options = {
      take,
      skip: (page - 1) * take,
      ...findManyOption,
    };

    const [data, total] = await this.getRepository().findAndCount(options);

    return new PaginationBuilder<T>()
      .setData(plainToInstance(this.classType, data))
      .setPage(page)
      .setTake(take)
      .setTotalCount(total)
      .build();
  }

  async findOne(filters: Partial<T>): Promise<T> {
    const findOption: FindOneOptions = { where: filters };
    const res = await this.getRepository().findOne(findOption);

    return plainToInstance(this.classType, res);
  }

  async findOneOrThrow(filters: Partial<T>): Promise<T> {
    const findOption: FindOneOptions = { where: filters };
    const res = await this.getRepository().findOne(findOption);

    if (!res) {
      let msgList = [];
      for (let [key, value] of Object.entries(filters)) {
        msgList.push(`${key}: ${value}`);
      }
      throw new BadRequestException(`don't exist ${msgList.join(', ')}`);
    }

    return plainToInstance(this.classType, res);
  }

  async findByIdOrThrow(id: number): Promise<T> {
    const findOption: FindOneOptions = { where: { id } };
    const res = await this.getRepository().findOne(findOption);

    if (!res) {
      throw new BadRequestException(`don't exist ${id}`);
    }
    return plainToInstance(this.classType, res);
  }

  async findByIdWithJoinOrThrow(
    id: number,
    findOptionsRelations: FindOptionsRelations<T>,
  ): Promise<T> {
    const findOption: FindOneOptions = {
      where: { id },
      relations: findOptionsRelations,
    };
    const res = await this.getRepository().findOne(findOption);

    if (!res) {
      throw new BadRequestException(`don't exist ${id}`);
    }
    return plainToInstance(this.classType, res);
  }

  async createEntity(entity: T): Promise<T> {
    const res = await this.getRepository().save(entity);
    return plainToInstance(this.classType, res);
  }

  async update(entity: T): Promise<T> {
    const res = await this.getRepository().save(entity);

    return plainToInstance(this.classType, res);
  }

  async deleteById(id: number) {
    await this.getRepository().softDelete(id);
  }

  async deleteByFilters(filters: FindOptionsWhere<T>) {
    await this.getRepository().softDelete(filters);
  }

  protected getRepository(): Repository<T> {
    return this.txManager.getEntityManager().getRepository(this.getName());
  }

  protected getQueryBuilder(): SelectQueryBuilder<T> {
    return this.txManager
      .getEntityManager()
      .getRepository(this.getName())
      .createQueryBuilder(String(this.getName()).toLowerCase());
  }
}
