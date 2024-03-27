import { Module } from '@nestjs/common';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { SubscriptionRepositoryModule } from 'src/entities/subscription/subscription.repository.module';
import { PostRepositoryModule } from 'src/entities/post/post-repository.module';

@Module({
  imports: [
    UserRepositoryModule,
    PostRepositoryModule,
    SubscriptionRepositoryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
