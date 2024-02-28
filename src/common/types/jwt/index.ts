import { User } from 'src/entities/user/user.entity';

export interface IJwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}

export interface IAccessTokenPayload {
  sub: User['id'];
}

export interface IRefreshTokenPayload {
  sub: User['id'];
}

export interface IValidatedRefreshToken {
  sub: User['id'];
  refreshToken: User['refreshToken'];
}
