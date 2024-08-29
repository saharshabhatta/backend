import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RoleUpdateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const { role } = request.body;

    // If no role is provided, allow the request
    if (!role) {
      return true;
    }

    // Admins can update to any role
    if (currentUser.role === 'admin') {
      return true;
    }

    // Staff can only update to 'staff' or 'user'
    if (currentUser.role === 'staff' && (role === 'staff' || role === 'user')) {
      return true;
    }

    // If the current user is neither admin nor staff, or is trying to set an unauthorized role
    throw new ForbiddenException('You are not authorized to update this role');
  }
}
