import { Module } from '@nestjs/common';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';

@Module({
  imports: [UserRepositoryModule],
  controllers: [],
  providers: [],
})
export class UserModule {}
