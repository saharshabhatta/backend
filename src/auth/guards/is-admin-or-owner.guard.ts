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
export class IsAdminOrOwnerGuard implements CanActivate {
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

    if (userRole === UserRole.ADMIN) {
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
