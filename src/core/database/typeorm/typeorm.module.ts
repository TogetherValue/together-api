import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule as OrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { TogetherConfigService } from 'src/core/config/config.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const entityPath = path.join(__dirname + './../../../entities/*/*.entity.js');
export class TypeOrmModule {
  static forRoot(): DynamicModule {
    return OrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [TogetherConfigService],
      useFactory: async (configService: TogetherConfigService) => {
        const dbConfig = configService.getDBConfig();

        return {
          type: 'postgres',
          host:
            process.env.NODE_ENV === 'prod' ? dbConfig.DB_HOST : 'localhost',
          port: Number(dbConfig.DB_PORT),
          database: dbConfig.DB_DATABASE,
          username: dbConfig.DB_USER_NAME,
          password: dbConfig.DB_PASSWORD,
          synchronize: false,
          entities: [entityPath],
          logging: false,
          namingStrategy: new SnakeNamingStrategy(),
          extra: {
            max: 10,
          },
        };
      },
    });
  }
}

export const getTypeOrmModule = (): DynamicModule => {
  return TypeOrmModule.forRoot();
};
