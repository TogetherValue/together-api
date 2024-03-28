import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { ScrapModule } from './modules/scrap/scrap.module';

const applicationModules = [
  AuthModule,
  UserModule,
  PostModule,
  ScrapModule,
  SubscriptionModule,
];

@Module({
  imports: [CoreModule, ...applicationModules],
  controllers: [],
  providers: [],
})
export class Modules {}
