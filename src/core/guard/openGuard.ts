import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtProvider } from '../jwt/jwt.provider';
import { Request } from 'express';

@Injectable()
export class OpenGuard extends AuthGuard('jwt') {
  constructor(public readonly jwtProvider: JwtProvider) {
    super();
  }

  getRequest(context: ExecutionContext): Request | null {
    return context.switchToHttp().getRequest<Request>();
  }

  extractToken(request: Request): string | null {
    const authorization = (request as Request).headers.authorization;

    if (authorization == null) return null;

    const [type, token] = authorization.split(' ');
    if (type.toLowerCase() !== 'bearer') return null;
    if (token == null) return null;

    return token;
  }

  async validate(request: Request, token: string): Promise<boolean> {
    if (token === null) return true;

    const payload = await this.jwtProvider.accessTokenVerifyAsync(token);
    if (payload) {
      request.user = { id: payload.sub };
    }

    return true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const token = this.extractToken(request);

    return await this.validate(request, token);
  }
}
