import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../types/types';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'The email address of the user',
    example: 'newemail@example.com',
  })
  readonly email?: string;

  @ApiPropertyOptional({
    description: 'The password for the user account',
    example: 'NewP@ssw0rd',
  })
  readonly password?: string;

  @ApiPropertyOptional({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  readonly role?: UserRole;
}
