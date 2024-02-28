import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { GithubProvider } from './service/github.provider';
import { HttpModule } from '@nestjs/axios';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';

@Module({
  imports: [HttpModule, UserRepositoryModule],
  controllers: [AuthController],
  providers: [AuthService, GithubProvider],
})
export class AuthModule {}
