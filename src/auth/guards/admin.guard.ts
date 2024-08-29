import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from 'src/users/types/types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in token');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    throw new ForbiddenException('You do not have the authorization');
  }
}
