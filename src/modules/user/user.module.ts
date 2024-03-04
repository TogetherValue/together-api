import { Module } from '@nestjs/common';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { SubscriptionRepositoryModule } from 'src/entities/subscription/subscription.repository.module';

@Module({
  imports: [UserRepositoryModule, SubscriptionRepositoryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
