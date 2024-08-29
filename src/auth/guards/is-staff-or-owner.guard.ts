import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/types/types';

@Injectable()
export class IsStaffOrOwnerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService, // Inject other services as needed
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const entity = this.reflector.get<string>('entity', context.getHandler());
    const userId = request.user?.sub;
    const userRole = request.user?.role;

    if (!entity) {
      throw new UnauthorizedException('Entity not specified');
    }

    // Allow admins or staff members to access any resource
    if (userRole === UserRole.ADMIN || userRole === UserRole.STAFF) {
      return true;
    }

    let resource = null;

    if (entity === 'User') {
      resource = await this.usersService.findOne(request.params.id);
      if (!resource || resource._id.toString() !== userId) {
        throw new ForbiddenException(
          'You are not authorized to access this resource',
        );
      }
    }

    return true;
  }
}
