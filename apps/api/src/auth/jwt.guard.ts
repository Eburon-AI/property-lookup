import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '@eburon/db';
import { SafeUserType } from 'src/types/safeUserType';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly roles?: UserRole[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET is not defined');

      const payload = jwt.verify(token, secret) as { data: SafeUserType };
      request.user = payload.data;

      if (this.roles && this.roles.length > 0) {
        if (!this.roles.includes(request.user.role)) {
          throw new ForbiddenException('Insufficient role');
        }
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token', err);
    }
  }
}
