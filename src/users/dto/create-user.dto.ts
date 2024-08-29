import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../types/types';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'P@ssw0rd',
  })
  password: string;
}
