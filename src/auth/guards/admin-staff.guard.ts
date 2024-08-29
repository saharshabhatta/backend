import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from 'src/users/types/types';

@Injectable()
export class AdminStaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.role === UserRole.STAFF || user.role === UserRole.ADMIN) {
      return true;
    }

    throw new ForbiddenException('You do not have the required role');
  }
}
