import { Module } from '@nestjs/common';
import { UserHistoryRepository } from './user-history.repository';

@Module({
  providers: [UserHistoryRepository],
  exports: [UserHistoryRepository],
})
export class UserHistoryRepositoryModule {}
