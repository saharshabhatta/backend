import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const entity = this.reflector.get<string>('entity', context.getHandler());
    const userId = request.user?.sub;

    let resource = null;

    if (entity === 'User') {
      resource = await this.usersService.findOne(request.params.id);

      if (resource._id.toString() !== userId) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action',
        );
      }
    }

    return true;
  }
}
