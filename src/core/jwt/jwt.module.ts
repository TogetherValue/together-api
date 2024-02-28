import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtProvider } from './jwt.provider';
import { AccessTokenStrategy } from './accessToken.strategy';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';

@Module({
  imports: [JwtModule.register({}), UserRepositoryModule],
  providers: [JwtProvider, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [JwtProvider],
})
export class JWTModule {}
